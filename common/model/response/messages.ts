import T, { ModelType } from "tsplate";
import { TMessage } from "../game/message";

export const TMessages = T.Object({ messages: T.Array(TMessage), version: T.Int });
export type Messages = ModelType<typeof TMessages>;
