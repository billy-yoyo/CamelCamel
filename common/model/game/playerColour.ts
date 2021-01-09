import T, { ModelType } from 'tsplate';

export const TPlayerColour = T.Enum('black', 'blue', 'green', 'yellow');
export type PlayerColour = ModelType<typeof TPlayerColour>;
