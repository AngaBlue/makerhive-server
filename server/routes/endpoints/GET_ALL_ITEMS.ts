import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";
import { Loan } from "../../entities/Loan";

export default new Endpoint({
    type: "GET_ALL_ITEMS",
    run: async (req, res, payload?) => {
        //Select All Items, with amount available = item.quantity - sum of quantity of current loans for that item
        let query = getRepository(Item)
            .createQueryBuilder("item")
            .select("item.*")
            .leftJoin(Loan, "loan", "loan.item = item.id AND loan.returned IS NULL")
            .groupBy("item.id")
            .addSelect("item.quantity - COALESCE(SUM(loan.quantity),0)", "available");
        //Hide Hidden Items from Non-Admin
        if (!req.user || req.user.rank.permissions < 5) query = query.where("item.hidden = 0");
        return await query.getRawMany();
    }
}); 