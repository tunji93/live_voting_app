import { Nomination } from './add-nomination';

type Participants = {
  [participantId: string]: string;
};

export type Nominations = {
  [nominationID: string]: Nomination;
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminId: string;
  hasStarted: boolean;
  nominations: Nominations;
};
