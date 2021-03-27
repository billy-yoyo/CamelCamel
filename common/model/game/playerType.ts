import T, { ModelType } from 'tsplate';

export const TPlayerType = T.Enum('human', 'easy-ai', 'medium-ai', 'hard-ai');
export type PlayerType = ModelType<typeof TPlayerType>;
