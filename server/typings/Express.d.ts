declare namespace Express {
    export interface User {
        id: number;
        name: string;
        email: string;
        joined: Date;
        image?: string;
        rank: {
            id: number;
            name: string;
            permissions: number;
        };
    }
}
