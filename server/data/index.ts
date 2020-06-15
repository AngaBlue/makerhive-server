///<reference path="../typings/database.d.ts"/>
import { db } from "..";
import { OkPacket, RowDataPacket, ResultSetHeader } from "mysql2";

//Add DB typings
class Data {
    users = {
        fetch: async (id: database.users["id"]) => {
            let user = (await db.query(`SELECT * FROM users WHERE id = ?;`, [id]))[0][0] as RowDataPacket as database.users;
            return user
        },
        fetchByEmail: async (email: database.users["email"]) => {
            let user = (await db.query(`SELECT * FROM users WHERE email = ?;`, [email]))[0][0] as RowDataPacket as database.users
            return user
        },
        fetchAll: async () => {
            return (await db.query(`SELECT * FROM users;`))[0] as RowDataPacket[] as database.users[];
        },
        add: async (user: Pick<database.users, "name" | "email" | "image">) => {
            return ((await db.execute(`INSERT INTO users (name, email, image) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, image = ?`, [user.name, user.email, user.image || null, user.name, user.image || null]))[0] as OkPacket | ResultSetHeader)
        },
        update: async (user: { id: database.users["id"] } & Partial<Pick<database.users, "name" | "email" | "rank">>) => {
            let oldUser = await this.users.fetch(user.id)
            let newUser = Object.assign(oldUser, user)
            return (await db.execute(`UPDATE users SET name = ?, email = ?, rank = ? WHERE id = ?`, [newUser.name, newUser.email, newUser.rank, newUser.id]))[0]
        }
    }
    borrowedItems = {
        fetchAll: async () => {
            /*return (await db.query(`SELECT item, borrowedItems
            FROM items, borrowedItems 
            
            WHERE borrowedItems.returned = 1 && borrowedItems.item = items.id`))*/
        },
        fetch: async (id: database.borrowedItems["id"]) => {
            return (await db.query(`SELECT * FROM borrowedItems WHERE id = ?`, [id]))[0][0] as RowDataPacket as database.borrowedItems;
        },
        return: async (id: database.borrowedItems["id"]) => {
            return (await db.query(`UPDATE borrowedItems SET returned = 1, returnDate = ? WHERE id = ?`), [Date.now(), id])
        },
        add: async (loan: Pick<database.borrowedItems, "user" | "item" | "quantity" | "note">) => {
            return (await db.query(`INSERT INTO borrowedItems (user, item, quantity, borrowTime, note) VALUES (?, ?, ?, ?, ?)`, [loan.user, loan.item, loan.quantity, Date.now(), loan.note || null]))[0] as OkPacket
        }
    }
    ranks = {
        fetchAll: async () => {
            return (await db.query(`SELECT * FROM ranks;`))[0] as RowDataPacket as database.ranks[];
        }
    }
    items = {
        fetchAll: async () => {
            //Select All Items, Available = Quantity - Sum All Currently Borrowed
            return (await db.query(`SELECT *, 
                (items.quantity - COALESCE((SELECT SUM(quantity) FROM borrowedItems
                    WHERE borrowedItems.item = items.id && borrowedItems.returned = 0), 0))
                as available FROM items`))[0] as RowDataPacket as ({ available: number } & database.items)[];
        },
        add: async (item: { name: database.users["name"] } & Partial<Pick<database.items, "image" | "description" | "hidden">>) => {
            return (await db.query(`INSERT INTO items (name, image, description, hidden) VALUES (?, ?, ?, ?)`, [item.name, item.image || null, item.description || null, item.hidden || 0]))[0]
        }
    }
    cache = {
        ranks: [] as database.ranks[]
    }
}
export default new Data;

import "./scheduled";