import { Endpoint } from "../api";
import joi from "@hapi/joi";
import { getRepository } from "typeorm";
import { Item } from "../../entities/Item";
import processImage from "../api/processImage";
import path from "path";
import fs from "fs";

export default new Endpoint({
    type: "PATCH_ITEM",
    authenticated: true,
    permissions: 5,
    schema: joi.object({
        id: joi.number().integer().min(0).required(),
        name: joi.string().max(128),
        quantity: joi.number().integer().min(1).max(255),
        description: joi.string().max(1024),
        location: joi.string().max(64),
        hidden: joi.boolean()
    }),
    run: async (
        req,
        res,
        payload: Pick<Item, "id"> & Partial<Pick<Item, "name" | "quantity" | "description" | "location" | "hidden">>
    ) => {
        //Find Item
        let item = await getRepository(Item).findOne(payload.id);
        if (!item)
            throw {
                name: "Unknown Item",
                message: "The item specified does not exist."
            };
        //Process Images
        if (req.file) {
            //Image Name = ItemID + Current Date to Random String to avoid cache collisions
            let imageName = `${item.id}-${Date.now().toString(32)}`;
            await processImage(req.file.buffer, path.join(__dirname, "../../../static/images/item"), imageName);
            if (item.image) {
                //Delete old images asynchronously (non-blocking)
                fs.unlink(path.join(__dirname, "../../../static/images/item", item.image, ".jpg"), () => {});
                fs.unlink(path.join(__dirname, "../../../static/images/item", item.image, "-thumb.jpg"), () => {});
            }
            //Update Database
            item.image = imageName;
        }
        //Update Item Properties
        item.name = payload.name !== undefined ? payload.name : item.name;
        item.quantity = payload.quantity !== undefined ? payload.quantity : item.quantity;
        item.description = payload.description !== undefined ? payload.description : item.description;
        item.location = payload.location !== undefined ? payload.location : item.location;
        item.hidden = payload.hidden !== undefined ? payload.hidden : item.hidden;
        return await getRepository(Item).save(item);
    }
});
