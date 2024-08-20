import { Request, Response } from 'express';

// services
import { accountService, organizationAccountService } from '../services';

// exceptions
import { ExistData, DataNotFound, WrongFormat } from '../utility/exceptions';

class AccountController {
    static async createAccounts(req : Request, res : Response) {
        try {
            const newAccount = await accountService.createAccount(req.body, 'f9952f8b-414e-4ce4-9a6e-b8ddf99e2351');
            
            return res.status(201).json({
                "status" : "success",
                "message" : "account created",
                "userMessage" : "",
                "data" : newAccount,
            });

        } catch(e) {

            if (e instanceof ExistData) {
                return res.status(409).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof WrongFormat) {
                return res.status(403).json({
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

    static async createSuperadminAccount(req : Request, res : Response) {
        try {
            const newAccount = await organizationAccountService.createSuperAdmin(req.body)

            return res.status(201).json({
                "status" : "success",
                "message" : "super admin created",
                "userMessage" : "",
                "data" : newAccount,
            });

        } catch(e) {

            if (e instanceof ExistData) {
                return res.status(409).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof WrongFormat) {
                return res.status(403).json({
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
}


export default AccountController;