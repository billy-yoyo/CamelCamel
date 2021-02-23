import { Request, request } from './apiTest';
import { Expectations, ModelExpectation, ResponseExpectation, Message } from "./apiExpectation";
import { Response } from 'node-fetch';

const partialModelMatch = <R>(model: R, parts: any): boolean => {
    if (Array.isArray(parts)) {
        return parts.every((part, index) => {
            if (part !== undefined) {
                const modelPart = (model as any)[index];
                if (modelPart === undefined) {
                    return false;
                } else {
                    return partialModelMatch(modelPart, part);
                }
            } else {
                return true;
            }
        });
    } else if (typeof parts === 'object' && parts !== null) {
        return Object.keys(parts).every(key => {
            const part = parts[key];
            const modelPart = (model as any)[key];
            if (part !== undefined) {
                if (modelPart === undefined) {
                    return false;
                } else {
                    return partialModelMatch(modelPart, part);
                }
            } else {
                return true;
            }
        });
    } else {
        return model === parts;
    }
};

export class Expect<B, R> {
    private request: Request<B, R>;
    private expectations: Expectations<R>;
    
    constructor(request: Request<B, R>, expectations: Expectations<R>) {
        this.request = request;
        this.expectations = expectations;
    }

    withModel(modelExpectation: ModelExpectation<R>): Expect<B, R> {
        const expectations = (this.expectations.modelExpectations || []).slice();
        expectations.push(modelExpectation);

        return new Expect(this.request, {
            modelExpectations: expectations
        });
    }

    withResponse(responseExpectations: ResponseExpectation): Expect<B, R> {
        const expectations = (this.expectations.responseExpectations || []).slice();
        expectations.push(responseExpectations);

        return new Expect(this.request, {
            responseExpectations: expectations
        });
    }

    status(statusCode: number, message: Message<Response>) {
        return this.withResponse({ 
            message: message || ((resp) => `expected status to be ${statusCode}, got status ${resp.status}`), 
            validator: (response) => response.status === statusCode
        });
    }

    isOk(message?: Message<Response>) {
        return this.status(200, message);
    }

    is2xx(message?: Message<Response>) {
        return this.withResponse({
            message: message || ((resp) => `expected status to be 2xx, got status ${resp.status}`),
            validator: (response) => 200 <= response.status && response.status < 300
        });
    }

    isNot2xx(message?: Message<Response>) {
        return this.withResponse({
            message: message || ((resp) => `expected status not to be 2xx, got status ${resp.status}`),
            validator: (response) => response.status < 200 || response.status >= 300
        });
    }

    model(parts: any, message?: Message<R>) {
        return this.withModel({
            message: message || ((model) => `expected model with parts ${JSON.stringify(parts)}, got model ${JSON.stringify(model)}`),
            validator: (model) => partialModelMatch(model, parts)
        })
    }

    async assert() {
        return request({...this.request, expectations: this.expectations});
    }
}

export default <B, R>(request: Request<B, R>): Expect<B, R> => {
    return new Expect(request, {});
};
