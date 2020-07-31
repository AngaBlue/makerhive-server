import { Endpoint } from "../api";
import Joi from "@hapi/joi";
import { User } from "../../entities/User";
import { getRepository } from "typeorm";

export default new Endpoint({
    type: "GET_USER",
    authenticated: false,
    schema: Joi.number().integer().min(0).optional(),
    run: async (req, res, payload?) => {
        if (payload) {
            if (!req.user || req.user.rank.permissions < 5)
                throw {
                    name: "Unauthorised",
                    message: "You are not authorised to retrieve other user's data."
                }
            let user = await getRepository(User).findOne({ where: { id: payload }, relations: ["rank"] })
            if (!user) throw {
                name: "Unknown User",
                message: "The user specified does not exist."
            };
            return user
        }
        //Without Payload
        return req.user || null;
    }
});
