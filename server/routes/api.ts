///<reference path="../typings/Express.d.ts"/>
import { Router } from "express";
import joi from "@hapi/joi";

const router = Router()

const APIRequestSchema = joi.object({
    id: joi.number().integer().min(0).required(),
    type: joi.string().required(),
    payload: joi.any()
})

export class Endpoint {
    type: string
    authenticated: boolean
    permissions: number
    schema?: joi.Schema
    run: Function

    constructor(endpoint: {
        type: string
        authenticated?: boolean
        permissions?: number
        schema?: joi.Schema
        run(req: Express.Request, res: Express.Response, payload?: any): any
    }) {
        this.type = endpoint.type
        this.run = endpoint.run
        this.authenticated = endpoint.authenticated || false
        this.permissions = endpoint.permissions || 0
        this.schema = endpoint.schema
    }
}

import endpoints from "./endpoints";

router.post("/", async (req, res, next) => {
    async function handleRequest(apiReq: APIRequest): Promise<APIResponse> {
        //Find endpoint
        let endpoint = endpoints.find(e => e.type === apiReq.type);
        if (!endpoint) {
            return {
                id: apiReq.id,
                type: apiReq.type,
                error: {
                    name: "Unknown Endpoint",
                    message: `Unknown Endpoint "${apiReq.type}"`
                }
            }
        }
        //Check Auth
        if (endpoint.authenticated) {
            if (!req.user) return {
                id: apiReq.id,
                type: endpoint.type,
                error: {
                    name: "Unauthorised",
                    message: `Unauthorised Request.`
                }
            }
            if (endpoint.permissions) {
                if (req.user.rank.permissions < endpoint.permissions) return {
                    id: apiReq.id,
                    type: endpoint.type,
                    error: {
                        name: "Forbidden",
                        message: `Lacking Permissions.  Permission level required: ${endpoint.authenticated}`
                    }
                }
            }
        }
        //Check Payload Schema
        if (endpoint.schema) {
            var validation = endpoint.schema.validate(apiReq.payload)
            if (validation.error) return {
                id: apiReq.id,
                type: endpoint.type,
                error: {
                    name: "Malformed Payload",
                    message: validation.error.message
                }
            }
        }
        //Execute Request
        return new Promise(async (resolve, reject) => {
            try {
                //Resolve Response Asynchonously
                let payload = await (Promise.resolve(endpoint.run(req, res, validation.value)))
                if (payload === undefined) {
                    resolve({
                        id: apiReq.id,
                        type: endpoint.type,
                    })
                } else {
                    resolve({
                        id: apiReq.id,
                        type: endpoint.type,
                        payload
                    })
                }
            } catch (error) {
                //Resolve Error Response
                let errorResponse: APIResponse = {
                    id: apiReq.id,
                    type: apiReq.type
                }
                if (error.stack && process.env.env !== "DEV") {
                    errorResponse.error = {
                        name: "Internal Server Error",
                        message: "An unexpected internal server error occurred.  This has been logged to our developers."
                    }
                    console.error(error)
                } else {
                    errorResponse.error = {
                        name: error.name || "Error",
                        message: error.message || "An error occurred while processing your request."
                    }
                }
                if (error.stack) console.error(error)
                return resolve(errorResponse)
            }
        })
    }
    //Validate Request Structure
    if (!req.body) return res.send({
        error: {
            name: "Malformed Request",
            message: "Invalid API request structure."
        }
    })
    let body = APIRequestSchema.validate(req.body)
    if (body.error) return res.send({
        error: {
            name: "Malformed Request",
            message: body.error.message
        }
    })
    let response = await handleRequest(body.value as APIRequest)
    //Send Response
    return res.send(response)
})

interface APIResponse {
    id: number;
    type: string;
    payload?: any;
    error?: {
        name: string,
        message: string
    }
}

interface APIRequest {
    id: number,
    type: string,
    payload?: any
}

export default router;