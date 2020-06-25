import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import { Rank } from "../../entities/Rank";

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
    run: async (req, res, payload: { id: User["id"]; rank?: Rank["id"] } & Partial<Pick<User, "name" | "email">>) => {
        //Check Valid User
        let user = await getRepository(User).findOne({
            where: { id: payload.id },
            relations: ["rank"]
        });
        if (!user)
            throw {
                name: "Unknown User",
                message: "The user specified does not exist."
            };
        //If User to be modified has higher permissions
        if (user.rank.permissions > req.user.rank.permissions)
            throw {
                name: "Forbidden",
                message: "Lacking permissions to modify this user."
            };
        //Check Valid Rank
        if (payload.rank) {
            let rank = await getRepository(Rank).findOne(payload.rank);
            if (!rank)
                throw {
                    name: "Unknown Rank",
                    message: "The rank specified does not exist."
                };
            if (rank.permissions > req.user.rank.permissions)
                throw {
                    name: "Forbidden",
                    message: "Can't set ranks higher than your own."
                };
            user.rank = rank;
        }
        //Update User Properties
        if (payload.name) user.name = payload.name;
        if (payload.email) user.email = payload.email;
        //Update
        return await getRepository(User).save(user);
    }
});
