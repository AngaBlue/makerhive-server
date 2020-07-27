import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";
import processImage from "../api/processImage";
import path from "path";
import { Loan } from "../../entities/Loan";

export default new Endpoint({
    type: "POST_ADD_ITEM",
    authenticated: true,
    permissions: 5,
    schema: joi.object({
        name: joi.string().max(128).required(),
        quantity: joi.number().integer().min(1).max(255).required(),
        description: joi.string().max(1024),
        location: joi.string().max(64)
    }),
    run: async (
        req,
        res,
        payload: Pick<Item, "name" | "quantity"> & Partial<Pick<Item, "description" | "location" | "hidden">>
    ) => {
        //Create
        let item = getRepository(Item).create({
            name: payload.name,
            quantity: payload.quantity,
            description: payload.description || null,
            location: payload.location || null,
            hidden: payload.hidden || false
        });
        item = await getRepository(Item).save(item);
        //Process Images
        if (req.file) {
            //Image Name = ItemID + Current Date to Random String to avoid cache collisions
            let imageName = `${item.id}-${Date.now().toString(32)}`;
            await processImage(req.file.buffer, path.join(__dirname, "../../../static/images/item"), imageName);
            //Update Database
            item.image = imageName;
            item = await getRepository(Item).save(item);
        }
        return await getRepository(Item)
            .createQueryBuilder("item")
            .select("item.*")
            .leftJoin(Loan, "loan", "loan.item = item.id AND loan.returned IS NULL")
            .groupBy("item.id")
            .andWhere("item.id = :id", { id: item.id })
            .addSelect("item.quantity - COALESCE(SUM(loan.quantity),0)", "available")
            .getRawOne();
    }
});
