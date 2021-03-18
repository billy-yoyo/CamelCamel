import * as React from 'react';
import { Message } from '../../../common/model/game/message';
import './message.less';

interface MessageProps {
    message: Message;
}

export default ({ message }: MessageProps): JSX.Element => {
    return (
        <div className="chat-message">
            <div className="chat-message-author">
                {message.author}:
            </div>
            <div className="chat-message-body">
                {message.body}
            </div>
        </div>
    );
};
