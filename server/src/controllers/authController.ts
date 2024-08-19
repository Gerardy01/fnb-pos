import { Request, Response } from 'express';

// services
import { authService } from '../services';


class AuthController {
    async login(req : Request, res : Response) {
        try {

            const token = authService.login(req.body);
            
            res.send("success")
        } catch(e) {
            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }

    async logout(req : Request, res : Response) {
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

    async requestAccessToken(req : Request, res : Response) {
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

export default new AuthController();