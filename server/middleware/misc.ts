import { json } from "express";
import { app } from "../server";

app.use(json());
app.disable("x-powered-by");
