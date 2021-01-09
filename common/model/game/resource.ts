import T, { ModelType } from 'tsplate';

export const TResource = T.Enum('purple', 'pink', 'grey', 'green', 'blue', 'brown', 'red', 'white');
export type Resource = ModelType<typeof TResource>;
