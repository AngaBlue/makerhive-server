import { Endpoint } from "../api";
import data from "../../data"

export default new Endpoint({
    type: "GET_ALL_RANKS",
    authenticated: true,
    permissions: 5,
    run: async (req, res, payload?) => {
        return data.cache.ranks;
    }
});