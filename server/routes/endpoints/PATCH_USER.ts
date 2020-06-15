import { Endpoint } from "../api";
import joi from "@hapi/joi";
import data from "../../data"

export default new Endpoint({
    type: "PATCH_USER",
    authenticated: true,
    permissions: 5,
    schema: joi.object({
        id: joi.number().required(),
        name: joi.string().min(1).max(64),
        email: joi.string().email().max(255),
        rank: joi.number().integer()
    }),
    run: async (req, res, payload: { id: database.users["id"] } & Partial<Pick<database.users, "name" | "email" | "rank">>) => {
        //Check Valid User
        let user = await data.users.fetch(payload.id)
        if (!user) throw {
            name: "Unknown User",
            message: "The user specified does not exist."
        }
        //Check Valid Rank
        if (payload.rank) {
            let rank = data.cache.ranks.find(r => r.id === payload.rank)
            if (!rank) throw {
                name: "Unknown Rank",
                message: "The rank specified does not exist."
            }
        }
        //Update
        await data.users.update(payload)
        return;
    }
});