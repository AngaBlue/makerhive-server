import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";
import Joi from "@hapi/joi";

export default new Endpoint({
    type: "GET_ITEM_DETAILS",
    schema: Joi.number().integer().min(0).required(),
    run: async (req, res, payload: number) => {
        //Get All Items w/ Active Loans, Reservations and Where Not Hidden
        let item = await getRepository(Item)
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.loans", "loan", "loan.returned IS NULL")
            .leftJoinAndSelect("loan.user", "loanUser")
            .leftJoinAndSelect("item.reservations", "reservation")
            .leftJoinAndSelect("reservation.user", "reservationUser")
            .where("item.id = :id", { id: payload })
            .andWhere("item.hidden = 0")
            .getOne();
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
