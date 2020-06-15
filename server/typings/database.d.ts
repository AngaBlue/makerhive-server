type Bool = 0 | 1

declare namespace database {
    export interface items {
        id: number
        name: string
        description?: string
        quantity: string
        image?: string
        hidden: Bool
    }
    export interface borrowedItems {
        id: number
        user: users["id"]
        item: items["id"]
        quantity: number
        borrowTime: number
        returnDate?: number
        note?: string
        returned: Bool
    }
    export interface notifications {
        id: number
        user: users["id"]
        message: string
        timestamp: number
        read: Bool
    }
    export interface ranks {
        id: number
        name: string
        permissions: number
    }
    export interface sessions {
        session_id: string
        expires: number
        data: string
    }
    export interface users {
        id: number
        name: string
        email: string
        rank: ranks["id"]
        joined: number
        image?: string
    }
}