import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Reservation } from "../../entities/Reservation";

export default new Endpoint({
    type: "GET_ALL_RESERVATIONS",
    authenticated: true,
    permissions: 5,
    run: async (req, res) => {
        return await getRepository(Reservation).find({ relations: ["user", "item"] })
    }
});