import { Nominations, Rankings } from 'src/interfaces/poll';
import { Result } from 'src/interfaces/results';

export const getResult = (
  rankings: Rankings,
  nominations: Nominations,
  votesPerVoter: number,
): Result[] => {
  const scores: { [nominationId: string]: number } = {};

  Object.keys(nominations).forEach((nominationId: string) => {
    scores[nominationId] = 0;
  });

  Object.values(rankings).forEach((userRankings) => {
    userRankings.forEach((nominationID, n) => {
      const voteValue = votesPerVoter - n;
      scores[nominationID] = scores[nominationID] + voteValue;
    });
  });

  const results = Object.entries(scores).map(([nominationId, score]) => ({
    nominationId,
    text: nominations[nominationId].text,
    score,
  }));

  // 3. Sort values by score in descending order
  results.sort((res1, res2) => res2.score - res1.score);

  return results;
};
