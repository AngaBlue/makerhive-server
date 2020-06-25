import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Notification } from "../../entities/Notification";

export default new Endpoint({
    type: "GET_NOTIFICATIONS",
    authenticated: true,
    run: async (req, res) => {
        //Get All Notifications for User
        return await getRepository(Notification).find({ user: req.user });
    }
});
