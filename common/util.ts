
export function chooseLetter(alphabet: string) {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

export async function randomId(alphabet: string, length: number, validator?: (id: string) => Promise<boolean>): Promise<string> {
    let id: string;
    let valid: boolean = false;
    while (!valid) {
        id = new Array(length).fill(0).map(() => chooseLetter(alphabet)).join('');
        valid = !validator || await validator(id);
    }
    return id;
}