import { Nomination } from './add-nomination';

type Participants = {
  [participantId: string]: string;
};

export type Nominations = {
  [nominationId: string]: Nomination;
};

export type Rankings = {
  [userId: string]: string[];
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminId: string;
  hasStarted: boolean;
  nominations: Nominations;
  rankings: Rankings;
};
