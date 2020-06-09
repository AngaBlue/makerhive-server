declare namespace Express {
    export interface User extends Omit<database.users, "rank"> {
        rank: database.ranks
    }
}