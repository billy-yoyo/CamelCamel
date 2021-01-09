import T, { ModelType } from 'tsplate';

export const TActionType = T.Enum('place', 'move', 'pickup', 'transport');
export type ActionType = ModelType<typeof TActionType>;
