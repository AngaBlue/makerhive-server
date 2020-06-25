import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { Loan } from "../../entities/Loan";
import { getRepository, IsNull } from "typeorm";

export default new Endpoint({
    type: "PATCH_RETURN_LOAN",
    authenticated: true,
    schema: joi.number().integer().required(),
    run: async (req, res, payload: Loan["id"]) => {
        //Check Valid Loan
        let loan = await getRepository(Loan).findOne({
            where: { id: payload, returned: IsNull() },
            relations: ["user"]
        });
        if (!loan)
            throw {
                name: "Unknown Loan",
                message: "The loan specified does not exist."
            };
        //If loan is not user's own, and user is not an admin
        if (loan.user.id !== req.user.id && req.user.rank.permissions < 5)
            throw {
                name: "Unknown Loan",
                message: "The loan specified does not exist."
            };
        //Update Loan
        loan.returned = new Date();
        return await getRepository(Loan).save(loan);
    }
});
