import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository, IsNull } from "typeorm";
import { Loan } from "../../entities/Loan";
import { Item } from "../../entities/Item";

export default new Endpoint({
    type: "POST_LOAN_ITEM",
    authenticated: true,
    permissions: 0,
    schema: joi.object({
        item: joi.number().integer().min(0).required(),
        quantity: joi.number().integer().min(1).required(),
        note: joi.string().max(1024)
    }),
    run: async (req, res, payload: Loan) => {
        //Check Against Borrow Quantity Limits
        let loans = await getRepository(Loan).find({ user: req.user, returned: IsNull() })
        //If Over Loan Limit
        if (loans.length > 4) throw {
            name: "Loan Limit Exceeded",
            message: "A limit of 4 loans per user is imposed.  Please return a loan to the Makerspace in order to loan another item."
        }
        //If Has an Overdue Loan
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
        let available = item.loans.reduce((acc, loan) => acc + loan.quantity, 0)
        if (payload.quantity > available) throw {
            name: "Insufficient Resources",
            message: `Only ${available} of the requested item ${available === 1 ? "is" : "are"} available.`
        }
        //Check Against Reservations
        //Check Amount of Reservations Before User (All If User has no reservation)
        //Check Amount Requested <= available - loaned - ^^
        //If User has Reservation, remove reservation if completely satisfied, update if partially satisfied

        //Borrow
        return;
    }
});