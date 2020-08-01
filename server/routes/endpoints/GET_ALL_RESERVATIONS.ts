import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Reservation } from "../../entities/Reservation";

export default new Endpoint({
    type: "GET_ALL_RESERVATIONS",
    authenticated: true,
    permissions: 5,
    run: async (req, res) => {
        //Get All Reservations w/ User and Item
        let reservations = await getRepository(Reservation)
            .createQueryBuilder("reservation")
            .leftJoinAndSelect("reservation.item", "item")
            .leftJoinAndSelect("reservation.user", "user")
            .leftJoinAndSelect("item.reservations", "itemRes", "itemRes.reserved < reservation.item")
            .orderBy("reservation.reserved", "ASC")
            .getMany();
        return reservations.map((r) => {
            r.position = r.item.reservations.length + 1;
            delete r.item.reservations;
            return r;
        });
    }
});
