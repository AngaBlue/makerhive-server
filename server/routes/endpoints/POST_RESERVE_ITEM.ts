import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { config } from "../../index";
import { Loan } from "../../entities/Loan";
import { Item } from "../../entities/Item";
import { Reservation } from "../../entities/Reservation";

export default new Endpoint({
    type: "POST_RESERVE_ITEM",
    authenticated: true,
    permissions: 0,
    schema: joi.object({
        item: joi.number().integer().min(0).required(),
        quantity: joi.number().integer().min(1).required(),
        note: joi.string().max(1024).allow("", null)
    }),
    run: async (req, res, payload: { item: Item["id"] } & Pick<Loan, "quantity" | "note">) => {
        //Check Against Reservation Limits
        let reservations = await getRepository(Reservation).find({
            user: req.user
        });
        //If Over Reservation Limit
        if (reservations.length > config.MAX_LOANS)
            throw {
                name: "Loan Limit Exceeded",
                message: `A limit of ${config.MAX_LOANS} reservation${
                    config.MAX_LOANS === 1 ? "" : "s"
                    } per user is imposed.  Please delete a reservation in order to reserve another item.`
            };
        //Check Item
        let item = await getRepository(Item)
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.reservations", "reservation")
            .leftJoinAndSelect("reservation.user", "reservationUser")
            .where("item.id = :item", { item: payload.item })
            .andWhere("item.hidden = 0")
            .getOne();
        if (!item)
            throw {
                name: "Unknown Item",
                message: "The item specified does not exist."
            };
        //Check Quantity Available
        if (payload.quantity > item.quantity)
            throw {
                name: "Insufficient Resources",
                message: `Only ${payload.quantity} of the requested item ${
                    payload.quantity === 1 ? "is" : "are"
                    } available.`
            };
        //Check if User has an Existing Reservation
        let userReservation = item.reservations.find((r) => r.user.id === req.user.id);
        if (userReservation)
            throw {
                name: "Item Reserved",
                message: `You have already placed a reservation on this item.`
            };
        //Reserve
        let reservation = getRepository(Reservation).create({
            item,
            quantity: payload.quantity,
            note: payload.note || null,
            user: req.user
        });
        reservation = await getRepository(Reservation).save(reservation);
        reservation = await getRepository(Reservation)
            .createQueryBuilder("reservation")
            .leftJoinAndSelect("reservation.item", "item")
            .leftJoinAndSelect("item.reservations", "itemRes", "itemRes.reserved < reservation.item")
            .where("reservation.id = :id", { id: reservation.id })
            .getOne();;
        reservation.position = reservation.item.reservations.length + 1;
        delete reservation.item.reservations;
        return reservation;
    }
});
