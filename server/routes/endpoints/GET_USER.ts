import { Endpoint } from "../api";

export default new Endpoint({
    type: "GET_USER",
    authenticated: true,
    run: async (req, res, payload?) => {
        return req.user;
    }
});
