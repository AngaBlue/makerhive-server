import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository, IsNull } from "typeorm";
import { config } from "../../index";
import { Loan } from "../../entities/Loan";
import { Item } from "../../entities/Item";
import { Reservation } from "../../entities/Reservation";

export default new Endpoint({
    type: "POST_LOAN_ITEM",
    authenticated: true,
    permissions: 0,
    schema: joi.object({
        item: joi.number().integer().min(0).required(),
        quantity: joi.number().integer().min(1).required(),
        note: joi.string().max(1024)
    }),
    run: async (req, res, payload: { item: Item["id"] } & Pick<Loan, "quantity" | "note">) => {
        //Check Against Borrow Quantity Limits
        let loans = await getRepository(Loan).find({ user: req.user, returned: IsNull() })
        //If Over Loan Limit
        if (loans.length > config.MAX_LOANS) throw {
            name: "Loan Limit Exceeded",
            message: `A limit of ${config.MAX_LOANS} loan${config.MAX_LOANS === 1 ? "" : "s"} per user is imposed.  Please return a loan to the Makerspace in order to loan another item.`
        }
        //If Has an Overdue Loan
        let overdue = loans.filter(loan => loan.borrowed.getUTCMilliseconds() + (config.LOAN_LENGTH as number) < Date.now())
        if (overdue.length > 0) throw {
            name: "Loan Overdue",
            message: `You have ${overdue.length} item ${overdue.length === 1 ? "" : "s"}.  Please return overdue loans to the Makerspace in order to loan another item`
        }
        //Check Item
        let item = await getRepository(Item).createQueryBuilder("item")
            .leftJoinAndSelect("item.loans", "loan", "loan.returned IS NULL")
            .leftJoinAndSelect("loan.user", "loanUser")
            .leftJoinAndSelect("item.reservations", "reservation")
            .leftJoinAndSelect("reservation.user", "reservationUser")
            .where("item.id = :item", { item: payload.item })
            .andWhere("item.hidden = 0")
            .getOne();
        if (!item) throw {
            name: "Unknown Item",
            message: "The item specified does not exist."
        }
        //Check Quantity Available
        let available = item.quantity - item.loans.reduce((acc, loan) => acc + loan.quantity, 0)
        if (available < 1) throw {
            name: "Insufficient Resources",
            message: `The requested item is unavailable.`
        }
        if (payload.quantity > available) throw {
            name: "Insufficient Resources",
            message: `Only ${available} of the requested item ${available === 1 ? "is" : "are"} available.`
        }
        //Check Against Reservations
        let userReservation = item.reservations.findIndex(r => r.user.id === req.user.id)
        let reservations = item.reservations.slice(0, userReservation === -1 ? item.reservations.length : userReservation).reduce((acc, r) => acc + r.quantity, 0)
        //Check Amount of Reservations Before User (All If User has no reservation)
        //Check Amount Requested <= available - loaned - reservations before user
        if (available - reservations < payload.quantity) throw {
            name: "Item Reserved",
            message: `You are unable to borrow this item as some, or all are unavailable.`
        }
        //If User has Reservation, remove reservation if completely satisfied, update if partially satisfied
        if (userReservation !== -1) {
            let reservation = item.reservations[userReservation]
            reservation.quantity -= payload.quantity
            //If Reservation fully loaned, delete, else update
            if (reservation.quantity < 1)
                await getRepository(Reservation).delete(reservation.id)
            else
                await getRepository(Reservation).save(reservation)
        }
        //Borrow
        let loan = getRepository(Loan).create({
            item,
            quantity: payload.quantity,
            note: payload.note || null,
            user: req.user
        })
        await getRepository(Loan).save(loan)
        return await getRepository(Loan).findOne({ where: { id: loan.id}, relations: ["item"] })
    }
});