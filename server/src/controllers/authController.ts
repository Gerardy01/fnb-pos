import { Request, Response } from 'express';
import sequelize from "../config/database";

// services
import { authService } from '../services';

// exceptions
import { DataNotFound, NotValid } from '../utility/exceptions';

// types and interfaces
import { Transaction  } from 'sequelize';


class AuthController {
    static async login(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {
    
            const userAgent = req.get('User-Agent') || "";
            const tokenData = await authService.login(req.body, userAgent, transaction);
    
            res.cookie('refreshToken', tokenData.refreshToken , {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds (following token expiry time)
                sameSite: 'none'
            });
    
            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "login success",
                "userMessage" : "",
                "data" : {
                    "accessToken" : tokenData.accessToken
                },
            });

        } catch(e) {

            transaction.rollback();

            if (e instanceof DataNotFound) {
                return res.status(401).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof NotValid) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "500",
                "errors" : e
            });
        }
    }

    static async superAdminLogin(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {
            const userAgent = req.get('User-Agent') || "";

            const tokenData = await authService.superAdminLogin(req.body, userAgent, transaction);

            res.cookie('refreshToken', tokenData.refreshToken , {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds (following token expiry time)
            });

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "login success",
                "userMessage" : "",
                "data" : {
                    "accessToken" : tokenData.accessToken
                },
            });

        } catch(e) {

            transaction.rollback();

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
                "userMessage" : "500",
                "errors" : e
            });
        }
    }

    static async logout(req : Request, res : Response) {
        try {
            const refreshToken = req.cookies.refreshToken || "";
            authService.logout(refreshToken);
            
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
            });

            return res.status(200).json({
                "status" : "success",
                "message" : "logout success",
                "userMessage" : "Logout success",
            });

        } catch(e) {

            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "500",
                "errors" : e
            });
        }
    }

    static async logoutAll(req : Request, res : Response) {

        try {
            const accountId = req.user ? req.user.accountId : "";
            const revoked = await authService.logoutAllSession(accountId);

            return res.status(200).json({
                "status" : "success",
                "message" : "logout success",
                "userMessage" : "",
                "data" : revoked
            });

        } catch(e) {
            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "500",
                "errors" : e
            });
        }
    }

    static async requestAccessToken(req : Request, res : Response) {
        try {

            const userAgent = req.get('User-Agent') || "";

            const refreshToken = req.cookies.refreshToken || "";
            const newAccessToken = await authService.generateAccessToken(refreshToken, userAgent);

            return res.status(200).json({
                "status" : "success",
                "message" : "new access token generated",
                "userMessage" : "",
                "data" : {
                    "accessToken" : newAccessToken
                },
            });

        } catch(e) {

            if (e instanceof NotValid) {
                return res.status(401).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "500",
                "errors" : e
            });
        }
    }
}

export default AuthController;