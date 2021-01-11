import T, { ModelType } from 'tsplate';

export const TActionType = T.Enum('place', 'move', 'pickup', 'transport', 'steal');
export type ActionType = ModelType<typeof TActionType>;
