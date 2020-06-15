import { Request, Response, NextFunction } from "express"
import { app } from "../server";

app.use(function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (error)
        console.error(error)
    next()
})