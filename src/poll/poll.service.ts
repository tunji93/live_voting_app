import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AddNominationData } from 'src/interfaces/add-nomination';
import { AddParticipant } from 'src/interfaces/add-participant';
import { Poll } from 'src/interfaces/poll';
import { PollResponse } from 'src/interfaces/poll-response';
import { submitRanking } from 'src/interfaces/submit-ranking';
import {
  createPollId,
  createUserID,
  createPollNominationID,
} from 'src/utils/generate-id';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { getResult } from './get-result';
import { PollRepository } from './poll.repository';

@Injectable()
export class PollService {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createPoll(createPollDto: CreatePollDto): Promise<PollResponse> {
    const pollId = createPollId();
    const userId = createUserID();
    const poll = await this.pollRepository.createPoll({
      ...createPollDto,
      pollId,
      userId,
    });
    const access_token = this.jwtService.sign({
      sub: userId,
      name: createPollDto.name,
      pollId,
    });

    return {
      poll,
      access_token,
    };
  }

  async joinPoll(joinPollDto: JoinPollDto): Promise<PollResponse> {
    const userId = createUserID();
    const poll = await this.pollRepository.getPoll(joinPollDto.pollId);

    const access_token = this.jwtService.sign({
      sub: userId,
      name: joinPollDto.name,
      pollId: joinPollDto.pollId,
    });

    return {
      poll,
      access_token,
    };
  }

  // async reJoinPoll(addParticipant: AddParticipant): Promise<Poll> {
  //   const poll = await this.pollRepository.addParticipant(addParticipant);
  //   return poll;
  // }
  async addParticipant(addParticipant: AddParticipant): Promise<Poll> {
    return await this.pollRepository.addParticipant(addParticipant);
  }

  async removeParticipant(
    pollId: string,
    userId: string,
  ): Promise<Poll | void> {
    const poll = await this.pollRepository.getPoll(pollId);
    if (!poll.hasStarted) {
      return await this.pollRepository.removeParticipant(pollId, userId);
    }
  }

  async getPoll(pollId: string): Promise<Poll> {
    return await this.pollRepository.getPoll(pollId);
  }
  async addNomination({
    pollId,
    userId,
    text,
  }: AddNominationData): Promise<Poll> {
    return this.pollRepository.addNomination({
      pollId,
      nominationId: createPollNominationID(),
      nomination: {
        userId,
        text,
      },
    });
  }

  async removeNomination(pollId: string, nominationId: string): Promise<Poll> {
    return this.pollRepository.removeNomination(pollId, nominationId);
  }

  async startPoll(pollId: string): Promise<Poll> {
    return await this.pollRepository.startPoll(pollId);
  }
  async submitRankings(submitRanking: submitRanking): Promise<Poll> {
    const { hasStarted, votesPerVoter } = await this.pollRepository.getPoll(
      submitRanking.pollId,
    );

    if (!hasStarted) {
      throw new BadRequestException(
        'Participants cannot rank until the poll has started.',
      );
    }
    if (submitRanking.rankings.length != votesPerVoter) {
      throw new BadRequestException(
        `Exactly ${votesPerVoter} nominations must be provided.`,
      );
    }
    return await this.pollRepository.submitRanking(submitRanking);
  }

  async cancelPoll(pollId: string): Promise<void> {
    await this.pollRepository.deletePoll(pollId);
  }

  async computeResults(pollId: string): Promise<Poll> {
    const poll = await this.pollRepository.getPoll(pollId);

    const results = getResult(
      poll.rankings,
      poll.nominations,
      poll.votesPerVoter,
    );

    return this.pollRepository.addResults(pollId, results);
  }
}
