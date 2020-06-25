import { Endpoint } from "../api";
import { getRepository, IsNull } from "typeorm";
import { Loan } from "../../entities/Loan";

export default new Endpoint({
    type: "GET_ALL_LOANS",
    authenticated: true,
    permissions: 5,
    run: async (req, res) => {
        return await getRepository(Loan).find({
            relations: ["user", "item"],
            where: { returned: IsNull() }
        });
    }
});
