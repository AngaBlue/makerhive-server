import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import { Loan } from "../../entities/Loan";

export default new Endpoint({
    type: "GET_USER_PROFILE",
    authenticated: true,
    schema: joi.number().integer().required(),
    run: async (req, res, payload: User["id"]) => {
        //If not moderator
        if (req.user.rank.permissions < 5 && req.user.id !== payload) throw {
            name: "Forbidden",
            message: "Lacking permissions to view this user's profile."
        }
        //Fetch Profile
        let user = await getRepository(User).findOne({ where: { id: payload }, relations: ["reservations", "rank", "reservations.item"] })
        user.loans = await getRepository(Loan).createQueryBuilder("loan")
            .leftJoinAndSelect("loan.item", "item")
            .orderBy("loan.returned IS NOT NULL")
            .limit(25)
            .getMany()
        if (!user) throw {
            name: "Unknown User Profile",
            message: "The user specified does not exist."
        }
        return user;
    }
});