import { Endpoint } from "../api";
import data from "../../data"

export default new Endpoint ({
    type: "GET_ALL_ITEMS",
    run: async (req, res, payload?) => {
        return await data.items.fetchAll();
    }
});