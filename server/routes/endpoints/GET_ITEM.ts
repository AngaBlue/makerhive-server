import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";
import Joi from "@hapi/joi";

export default new Endpoint({
    type: "GET_ITEM",
    authenticated: true,
    permissions: 5,
    schema: Joi.number().integer().min(0).required(),
    run: async (req, res, payload: number) => {
        //Get All Items w/ Active Loans, Reservations and Where Not Hidden
        let item = await getRepository(Item).findOne({ id: payload });
        if (!item)
            throw {
                name: "Unknown Item",
                message: "The item specified does not exist."
            };
        //Return with amount available
        return item;
    }
});
