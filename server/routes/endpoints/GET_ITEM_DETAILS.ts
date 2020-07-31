import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";
import Joi from "@hapi/joi";

export default new Endpoint({
    type: "GET_ITEM_DETAILS",
    schema: Joi.number().integer().min(0).required(),
    run: async (req, res, payload: number) => {
        //Get All Items w/ Active Loans, Reservations and Where Not Hidden
        let query = getRepository(Item)
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.loans", "loan", "loan.returned IS NULL")
            .leftJoinAndSelect("loan.user", "loanUser")
            .leftJoinAndSelect("item.reservations", "reservation")
            .leftJoinAndSelect("reservation.user", "reservationUser")
            .where("item.id = :id", { id: payload });
        //Hide Hidden Items from Non-Admin
        if (!req.user || req.user.rank.permissions < 5) query = query.andWhere("item.hidden = 0");
        let item = await query.getOne();
        if (!item)
            throw {
                name: "Unknown Item",
                message: "The item specified does not exist."
            };
        //Return with amount available
        return {
            ...item,
            available: item.quantity - item.loans.reduce((acc, loan) => acc + loan.quantity, 0)
        };
    }
});
