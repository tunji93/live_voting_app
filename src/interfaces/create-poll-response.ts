import { Request } from 'express';
import { Socket } from 'socket.io';
type Participants = {
  [participantId: string]: string;
};

export type CreatePollResponse = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminId: string;
  hasStarted: boolean;
};

export type AddParticipant = {
  pollId: string;
  name: string;
  userId: string;
};

export type RequestWithAuth = AddParticipant & Request;
export type SocketWithAuth = AddParticipant & Socket;
