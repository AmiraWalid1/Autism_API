declare module 'nanoid' {
    export function nanoid(size?: number): string;
    export function customAlphabet(alphabet: string, size: number): () => string;
}
