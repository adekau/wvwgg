export interface IGuildResponse {
    id: string;
    name: string;
    tag: string;
    emblem: {
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

/**
 * TODO:
 * [ ] make new testing dynamodb table
 * [ ] use step functions to get the guilds needed and batch them
 * [ ] send each batch to a lambda function that just fetches the guilds and saves them to the testing table
 * [ ] figure out how to handle failed fetches
 */