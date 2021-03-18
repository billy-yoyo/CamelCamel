import T from 'tsplate';

@T.constructor("author", "body", "timeSent")
export class Message {
    @T.template(T.String)
    public author: string;

    @T.template(T.String)
    public body: string;

    @T.template(T.Int)
    public timeSent: number;

    constructor(author: string, body: string, timeSent: number) {
        this.author = author;
        this.body = body;
        this.timeSent = timeSent;
    }
}

export const TMessage = T.AutoClass(Message);
