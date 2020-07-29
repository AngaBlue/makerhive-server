import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import { Loan } from "../../entities/Loan";
import { Reservation } from "../../entities/Reservation";

export default new Endpoint({
    type: "GET_USER_PROFILE",
    authenticated: true,
    schema: joi.number().integer().required(),
    run: async (req, res, payload: User["id"]) => {
        //If not moderator
        if (req.user.rank.permissions < 5 && req.user.id !== payload)
            throw {
                name: "Forbidden",
                message: "Lacking permissions to view this user's profile."
            };
        //Get User w/ Reservations & Rank
        let user = await getRepository(User).findOne({
            where: { id: payload },
            relations: ["rank"]
        });
        if (!user)
            throw {
                name: "Unknown User Profile",
                message: "The user specified does not exist."
            };
        //Get User Loans (Limit of 25 for client performance)
        user.loans = await getRepository(Loan)
            .createQueryBuilder("loan")
            .leftJoinAndSelect("loan.item", "item")
            .orderBy("loan.borrowed", "DESC")
            .where("loan.user = :id", user)
            .andWhere("loan.returned IS NULL")
            .limit(25)
            .getMany();
        //Get User Reservations
        let reservations = await getRepository(Reservation)
            .createQueryBuilder("reservation")
            .leftJoinAndSelect("reservation.item", "item")
            .leftJoinAndSelect("item.reservations", "itemRes", "itemRes.reserved < reservation.item")
            .where("reservation.user = :id", user)
            .orderBy("reservation.reserved", "DESC")
            .limit(25)
            .getMany();
        //Map Positions
        return {
            ...user,
            reservations: reservations.map((r) => {
                r.position = r.item.reservations.length + 1;
                delete r.item.reservations;
                return r;
            })
        };
    }
});
