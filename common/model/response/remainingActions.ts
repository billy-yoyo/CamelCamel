import T, {ModelType} from 'tsplate';

export const TRemainingActions = T.Object({remainingActions: T.Int})
export type RemainingActions = ModelType<typeof TRemainingActions>;
