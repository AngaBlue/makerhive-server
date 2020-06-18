import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository } from "typeorm";

export default new Endpoint({
    type: "PATCH_ITEM",
    authenticated: true,
    permissions: 5,
    schema: joi.object({}),
    run: async (req, res,) => {
        return;
    }
});