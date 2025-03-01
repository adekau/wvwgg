export interface IGuildResponse {
    id: string;
    name: string;
    tag: string;
    emblem?: {
        background: {
            id: number;
            colors: number[];
        };
        foreground: {
            id: 166;
            colors: number[];
        },
        flags: string[];
    }
}
