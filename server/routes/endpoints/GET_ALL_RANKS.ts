import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Rank } from "../../entities/Rank";

export default new Endpoint({
    type: "GET_ALL_RANKS",
    authenticated: true,
    permissions: 5,
    run: async (req, res, payload?) => {
        return await getRepository(Rank).find();
    }
});
