import { Endpoint } from "../api";
import Joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";

export default new Endpoint({
    type: "DELETE_ITEM",
    authenticated: true,
    permissions: 5,
    schema: Joi.number().integer().min(0).required(),
    run: async (req, res, payload: number) => {
        //Find Item by ID
        let item = await getRepository(Item).findOne({
            where: { id: payload }
        });
        if (!item)
            throw {
                name: "Unknown Item",
                message: "The specified item was not found."
            };
        await getRepository(Item).delete(item);
        return;
    }
});
