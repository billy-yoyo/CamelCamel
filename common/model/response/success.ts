import T, {ModelType} from 'tsplate';

export const TSuccess= T.Object({success: T.Boolean})
export type Success = ModelType<typeof TSuccess>;
