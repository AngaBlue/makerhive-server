import { json } from "express";
import { app } from "../server";

//Parse Body JSON
app.use(json());
//Disable Header
app.disable("x-powered-by");
