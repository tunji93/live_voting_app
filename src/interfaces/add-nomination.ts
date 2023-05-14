export type Nomination = {
  userId: string;
  text: string;
};

export type AddNomination = {
  pollId: string;
  nominationId: string;
  nomination: Nomination;
};

export type AddNominationData = {
  text: string;
  pollId: string;
  userId: string;
};
