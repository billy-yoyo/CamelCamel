

export const haltingSequence = async <I, T>(inputs: I[], seq: (inp: I) => Promise<T>, valid: (value: T) => boolean): Promise<T> => {
    let index = 0;

    while (index < inputs.length) {
        const result = await seq(inputs[index++]);
        if (valid(result)) {
            return result;
        }
    }

    return undefined;
};