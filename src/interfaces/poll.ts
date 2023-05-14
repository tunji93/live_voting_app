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

// export type AddParticipant = {
//   pollId: string;
//   name: string;
//   userId: string;
// };

// export type RequestWithAuth = AddParticipant & Request;
// export type SocketWithAuth = AddParticipant & Socket;
