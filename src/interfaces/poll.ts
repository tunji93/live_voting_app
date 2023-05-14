type Participants = {
  [participantId: string]: string;
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminId: string;
  hasStarted: boolean;
};
