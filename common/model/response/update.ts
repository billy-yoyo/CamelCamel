import T, {ModelType} from 'tsplate';

export const TUpdate= T.Object({update: T.Boolean})
export type Update = ModelType<typeof TUpdate>;
