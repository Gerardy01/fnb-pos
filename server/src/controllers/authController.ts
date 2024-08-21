import { Request, Response } from 'express';

// services
import { authService } from '../services';

// exceptions
import { DataNotFound } from '../utility/exceptions';


class AuthController {
    static async login(req : Request, res : Response) {
        const tokenData = await authService.login(req.body);
        try {

            
            return res.status(200).json({
                "status" : "success",
                "message" : "login success",
                "userMessage" : "",
                "data" : {
                    "accessToken" : tokenData.accessToken
                },
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(401).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }

    static async logout(req : Request, res : Response) {
        try {

        } catch(e) {
            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }

    static async requestAccessToken(req : Request, res : Response) {
        try {

        } catch(e) {
            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }
}

export default AuthController;