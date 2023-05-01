import { nanoid, customAlphabet } from 'nanoid';

export const createPollId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
);

export const createUserID = nanoid();
export const createPollNominationID = nanoid(8);
