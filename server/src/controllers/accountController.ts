import { Request, Response } from 'express';

// services
import { accountService, organizationAccountService } from '../services';

// exceptions
import { ExistData, DataNotFound, WrongFormat, NotValid, Forbidden } from '../utility/exceptions';

class AccountController {
    static async getUserAccountInfo(req : Request, res : Response) {

        try {
            const accountId = req.user ? req.user.accountId : "";
            const accountInfo = await accountService.getUserAccount(accountId);

            return res.status(200).json({
                "status" : "success",
                "message" : "user account info retrived",
                "userMessage" : "",
                "data" : accountInfo,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : "Account not found",
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

    static async createAccounts(req : Request, res : Response) {
        try {
            const organizationId = req.user ? req.user.organizationId : "";
            const userRoleName = req.user ? req.user.accountRoleName : "";
            const newAccount = await accountService.createAccount(req.body, organizationId, userRoleName);
            
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
                return res.status(422).json({
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
                return res.status(422).json({
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

    static async changePassword(req : Request, res : Response) {
        try {
            
            const accountId = req.user ? req.user.accountId : "";
            await accountService.changePaassword(req.body, accountId);

            return res.status(200).json({
                "status" : "success",
                "message" : "password changed",
                "userMessage" : "",
                "data" : {},
            });

        } catch(e) {

            if (e instanceof Forbidden) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : "ACCOUNT404-2",
                });
            }

            if (e instanceof WrongFormat) {
                return res.status(422).json({
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


export default AccountController;