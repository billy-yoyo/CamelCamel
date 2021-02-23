import { Response } from 'node-fetch';

export type Message<R> = string | ((model: R) => string);

const getMessage = <R>(message: Message<R>, model: R): string => {
    if (typeof message === 'string') {
        return message;
    } else {
        return message(model);
    }
}

export type ModelExpectation<T> = { message: Message<T>, validator: (model: T) => boolean };
export type ResponseExpectation = { message: Message<Response>, validator: (response: Response, data: any) => boolean };

export interface Expectations<T> {
    modelExpectations?: ModelExpectation<T>[];
    responseExpectations?: ResponseExpectation[];
}

export const validateModel = <T>(model: T, expectations: Expectations<T>) => {
    if (expectations.modelExpectations) {
        expectations.modelExpectations.forEach(expectation => {
            if (!expectation.validator(model)) {
                throw getMessage(expectation.message, model);
            }
        });
    }
};

export const validateResponse = <T>(response: Response, data: any, expectations: Expectations<T>) => {
    if (expectations.responseExpectations) {
        expectations.responseExpectations.forEach(expectation => {
            if (!expectation.validator(response, data)) {
                throw getMessage(expectation.message, response);
            }
        });
    }
};
