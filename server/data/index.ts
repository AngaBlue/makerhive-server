import { db } from "..";
import "../typings/database";

//Add DB typings
class Data {
    users = {
        fetch: async (id: number) => {
            let user = (await db.execute(`SELECT * FROM users WHERE id = ?;`, [id]))[0] as unknown as database.users;
            return {
                ...user,
                rank: this.cache.ranks.find(r => r.id === user.rank)
            }
        },
        fetchAll: async () => {
            return await db.execute(`SELECT * FROM users;`) as unknown as database.users[];
        },
        update: async (user: {
            id: database.users["id"]
            name?: database.users["name"]
            email?: database.users["email"]
            rank?: database.users["rank"]
        }) => {

        }
    }
    ranks = {
        fetchAll: async () => {
            return await db.query(`SELECT * FROM ranks;`) as unknown as database.ranks[];
        }
    }
    items = {
        fetchAll: async () => {
            //Select All Items, Available = Quantity - Sum All Currently Borrowed
            return await db.query(`SELECT *, 
                (items.quantity - COALESCE((SELECT SUM(quantity) FROM borrowedItems
                    WHERE borrowedItems.item = items.id && borrowedItems.returned = 0), 0))
                as available FROM items`) as unknown as ({ available: number } & database.items)[];
        },
        add: async (item: {
            name: database.items["name"]
            image?: database.items["image"]
            description?: database.items["description"]
            hidden?: database.items["hidden"]
        }) => {
            return await db.execute(`INSERT INTO items (name, image, description, hidden) VALUES (?, ?, ?, ?)`, [item.name, item.image || null, item.description || null, item.hidden || 0])
        }
    }
    cache = {
        ranks: [] as database.ranks[]
    }
}
export default new Data;

import "./scheduled";