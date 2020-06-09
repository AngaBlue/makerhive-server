import mysql from "mysql2/promise";
//Init Environmental Variables
const config = require("dotenv").config().parsed;
let db: mysql.Connection;
//Connect DB then Start Web Server
(async () => {
	db = await mysql.createConnection({
		host: "localhost",
		user: config["db.user"],
		database: config["db.database"],
		password: config["db.password"]
	})
	console.log(`Connected to DB: ${config["db.user"]}@localhost, ${config["db.database"]}`)
	require("./server");
})()

//Process
/*process.on("unhandledRejection", (err) => {
	console.error("Caught Exception", JSON.stringify(err))
})*/

//Exports
export { config, db };