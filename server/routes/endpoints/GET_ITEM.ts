import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";
import Joi from "@hapi/joi";
import { Loan } from "../../entities/Loan";

export default new Endpoint({
    type: "GET_ITEM",
    authenticated: true,
    permissions: 5,
    schema: Joi.number().integer().min(0).required(),
    run: async (req, res, payload: number) => {
        //Get All Items w/ Active Loans, Reservations and Where Not Hidden
        let item = await getRepository(Item)
            .createQueryBuilder("item")
            .select("item.*")
            .leftJoin(Loan, "loan", "loan.item = item.id AND loan.returned IS NULL")
            .groupBy("item.id")
            .where("item.id = :id", { id: payload })
            //.andWhere("item.hidden = 0")
            .addSelect("item.quantity - COALESCE(SUM(loan.quantity),0)", "available")
            .getRawOne();
        if (!item)
            throw {
                name: "Unknown Item",
                message: "The item specified does not exist."
            };
        //Return with amount available
        return item;
    }
});
