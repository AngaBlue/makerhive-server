import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";

export default new Endpoint({
    type: "GET_ALL_USERS",
    authenticated: true,
    permissions: 5,
    run: async (req, res, payload?) => {
        //Get All User w/ Rank
        return await getRepository(User).find({ relations: ["rank"] });
    }
});
