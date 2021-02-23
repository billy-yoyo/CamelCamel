

const wait = (ms: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

export default <T>(loop: () => Promise<T | undefined>, intervalMs: number, maxRepetitions: number): Promise<T | undefined> => {
    let repetitions = 0;
    const repeater: () => Promise<T | undefined> = () => loop().then(resp => {
        repetitions += 1;
        if (resp === undefined) {
            if (repetitions >= maxRepetitions) {
                return undefined;
            } else {
                return wait(intervalMs).then(() => repeater());
            }
        } else {
            return resp;
        }
    });

    return repeater();
};