import fs from 'fs';
import T, { Template } from 'tsplate';
import { Expectations, validateResponse, validateModel } from './apiExpectation';
import fetch from 'node-fetch';

const TConfig = T.Object({
    host: T.String,
    port: T.Int,
    ssl: T.Boolean
});

const configFile = process.env.apiConfig;
const file = fs.readFileSync(configFile, 'utf-8');
const configTransit = JSON.parse(file);

if (!TConfig.valid(configTransit)) {
    throw Error("invalid api config");
} 

const config = TConfig.toModel(configTransit);
const urlPrefix = `http${config.ssl ? 's' : ''}://${config.host}:${config.port}`;

export interface Request<B,R> {
    path: string;
    method: 'post' | 'get' | 'delete';
    body?: B;
    bodyTemplate?: Template<B, any>;
    responseTemplate?: Template<R, any>;
}

export type ExpectedRequest<B,R> = Request<B,R> & {expectations: Expectations<R>};

type RequestFactory<B, R> = (partial: Partial<Request<B, R>>) => Request<B, R>;

export const request = async <B,R>(r: ExpectedRequest<B,R>): Promise<void> => {
    const response = await fetch(
        `${urlPrefix}${r.path}`,
         {
            method: r.method || 'get',
            headers: r.body && {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(r.bodyTemplate ? r.bodyTemplate.toTransit(r.body) : r.body)
        }
    );

    const text = await response.text();
        
    let data;
    try {
        data = JSON.parse(text)
    } catch {
        data = undefined;
    }
    validateResponse(response, data, r.expectations);

    if (r.expectations.modelExpectations && r.expectations.modelExpectations.length > 0) {
        if (!r.responseTemplate) {
            validateModel(data as any, r.expectations);
        } else if (r.responseTemplate.valid(data)) {
            const model = r.responseTemplate.toModel(data);
            validateModel(model, r.expectations);
        } else {
            throw Error(`response ${text} doesn't match model`)
        }
    }
};


export const requestFactory = <B, R>(partial: Partial<Request<B, R>>): RequestFactory<B, R> => {
    return (r: Partial<Request<B, R>>) => {
        return Object.assign({}, partial, r) as Request<B, R>;
    };
};
