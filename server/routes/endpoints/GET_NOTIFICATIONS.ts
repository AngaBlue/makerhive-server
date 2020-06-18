import { Endpoint } from "../api";
import { getRepository } from "typeorm";
import { Notification } from "../../entities/Notification";

export default new Endpoint({
	type: "GET_ALL_RESERVATIONS",
	authenticated: true,
	run: async (req, res) => {
		return await getRepository(Notification).find({ user: req.user })
	}
});