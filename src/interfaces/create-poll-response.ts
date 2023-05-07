type Participants = {
  [participantId: string]: string;
};

export type CreatePollResponse = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminId: string;
};

export type AddParticipant = {
  pollId: string;
  name: string;
  userId: string;
};
