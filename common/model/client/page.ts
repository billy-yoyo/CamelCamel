import T, { ModelType } from 'tsplate';

export const TPage = T.Enum('home', 'game', 'loading')
export type Page = ModelType<typeof TPage>

