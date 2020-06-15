import { Endpoint } from "../api";
import joi from "@hapi/joi";
import data from "../../data"

export default new Endpoint({
    type: "PATCH_RETURN_ITEM",
    authenticated: true,
    schema: joi.number().integer().required(),
    run: async (req, res, payload: database.borrowedItems["id"]) => {
        //Check Valid Loan
        let loan = await data.borrowedItems.fetch(payload)
        if (!loan) throw {
            name: "Unknown Loan",
            message: "The loan specified does not exist."
        }
        //If loan is not user's own, and user is not an admin
        if (loan.id !== req.user.id && req.user!.rank.permissions < 5) throw {
            name: "Unknown Loan",
            message: "The loan specified does not exist."
        }
        //Update
        await data.borrowedItems.return(loan.id)
        return;
    }
});