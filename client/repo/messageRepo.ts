import { Messages, TMessages } from "../../common/model/response/messages";
import useLocalStorage from "../util/useLocalStorage";

export const storeMessages = (messages: Messages) => {
    localStorage.setItem('messages', JSON.stringify(TMessages.toTransit(messages)));
};

export const useMessages = (): [Messages, (player: Messages) => void] => useLocalStorage('messages', TMessages);
