import "reflect-metadata";
import { createConnection, Connection } from "typeorm";

//Init Environmental Variables
const config = require("dotenv").config().parsed;
let db: Connection;
//Connect DB then Start Web Server
(async () => {
    db = await createConnection();
    console.log(`Connected to DB: ${config.TYPEORM_USERNAME}@${config.TYPEORM_HOST}, ${config.TYPEORM_DATABASE}`);
    require("./server");
})();

//Exports
export { config, db };
