import * as React from 'react';
import { Hub } from '../../util/hub';
import './chat.less';
import Panel from './panel';
import Textbox from '../textbox';
import MessageComponent from './message';
import SendIcon from '../../images/send';
import * as networkService from '../../service/networkService';
import { Message } from '../../../common/model/game/message';

interface ChatProps {
    hub: Hub;
    setFocused: (focused: boolean) => void;
}

export default ({ hub, setFocused }: ChatProps): JSX.Element => {
    const [messageBody, setMessageBody] = React.useState<string>('');

    const sendMessage = async () => {
        if (hub && hub.game) {
            await networkService.sendMessage(hub.game.id, new Message(
                hub.player.id,
                messageBody,
                new Date().getTime()
            ));
        }
    };

    return (
        <Panel title="Chat" className="chat-panel">
            <div className="chat-messages">
                {
                    hub?.messages?.messages.map((message, i) => <MessageComponent message={message} key={`message-${i}`}/>)
                }
            </div>
            <div className="chat-box">
                <Textbox value={messageBody} 
                    setValue={setMessageBody} 
                    className="chat-box-input" 
                    onSubmit={sendMessage}
                    onFocusChange={setFocused}/>
                <div className="button primary chat-box-send" onClick={sendMessage}>
                    <SendIcon size="24px" colour="white"/>
                </div>
            </div>
        </Panel>
    )
};
