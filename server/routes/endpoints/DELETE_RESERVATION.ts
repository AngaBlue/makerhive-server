import { Endpoint } from "../api";
import Joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { Reservation } from "../../entities/Reservation";

export default new Endpoint({
    type: "DELETE_RESERVATION",
    authenticated: true,
    schema: Joi.number().integer().min(0).required(),
    run: async (req, res, payload: number) => {
        //Find Reservation by ID
        let reservation = await getRepository(Reservation).findOne({
            relations: ["user"],
            where: { id: payload }
        });
        if (!reservation)
            throw {
                name: "Unknown Reservation",
                message: "The specified resveration was not found."
            };
        if (req.user.rank.permissions < 5 && req.user.id !== reservation.user.id)
            throw {
                name: "Unknown Reservation",
                message: "The specified resveration was not found."
            };
        await getRepository(Reservation).delete(reservation);
        return;
    }
});
