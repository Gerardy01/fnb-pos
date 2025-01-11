import { Request, Response } from 'express';

// services
import { accountService, organizationAccountService } from '../services';

// exceptions
import { ExistData, DataNotFound, WrongFormat, NotValid, Forbidden } from '../utility/exceptions';

// types and interfaces
import { CheckAvailabilityQueryParams } from '../interfaces/IAccount';



class AccountController {
    static async getAllAccount(req : Request, res : Response) {

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const userRole = req.user ? req.user.accountRoleName : "";
            const accountId = req.user ? req.user.accountId : "";

            const accounts = await accountService.getAllAccount(organizationId, userRole, accountId);

            return res.status(200).json({
                "status" : "success",
                "message" : "account list retrived",
                "userMessage" : "",
                "data" : accounts,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : "no account found",
                    "userMessage" : "",
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
    
    static async getUserAccountInfo(req : Request, res : Response) {

        try {
            const accountId = req.user ? req.user.accountId : "";
            const accountInfo = await accountService.getUserAccountInfo(accountId);

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

    static async checkAvailability(req : Request<{}, {}, {}, CheckAvailabilityQueryParams>, res : Response) {
        const { username, email } = req.query;

        try {

            let isAvailable = false;
            if (username) {
                isAvailable = await accountService.checkUsernameAvailable(username);
            } else if(email) {
                isAvailable = await accountService.checkEmailAvailable(email);
            } else {
                throw new WrongFormat("need to specify either username or email under query params");
            }

            return res.status(200).json({
                "status" : "success",
                "message" : "",
                "userMessage" : "",
                "data" : {
                    "available" : isAvailable
                },
            });

        } catch(e) {

            if (e instanceof WrongFormat) {
                return res.status(400).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : "",
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

    static async editAccount(req : Request, res : Response) {
        try {

            const accountId = req.user ? req.user.accountId : "";
            const roleName = req.user ? req.user.accountRoleName : "";
            const returnData = await accountService.editAccount(req.body, accountId, roleName);

            return res.status(200).json({
                "status" : "success",
                "message" : returnData.message,
                "userMessage" : "",
                "data" : {
                    "newValue" : returnData.newValue
                }
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
                    "message" : "Account not found",
                    "userMessage" : "",
                });
            }

            if (e instanceof Forbidden || e instanceof NotValid) {
                return res.status(403).json({
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

    static async resetPassword(req : Request, res : Response) {
        try {

            const roleName = req.user ? req.user.accountRoleName : "";
            const isChanged = await accountService.resetPassword(req.body, roleName);

            return res.status(200).json({
                "status" : "success",
                "message" : "password changed",
                "userMessage" : "",
                "data" : isChanged
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : "Account not found",
                    "userMessage" : "",
                });
            }

            if (e instanceof Forbidden) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : "ACCOUNT403-2", // You dont have permission to do this action
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
            const changed = await accountService.changePaassword(req.body, accountId);

            return res.status(200).json({
                "status" : "success",
                "message" : "password changed",
                "userMessage" : "",
                "data" : changed,
            });

        } catch(e) {

            if (e instanceof Forbidden) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : "ACCOUNT403-1", // Wrong password.
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

    static async editAccountManagement(req : Request, res : Response) {
        try {
            const roleName = req.user ? req.user.accountRoleName : "";
            const organizationId = req.user ? req.user.organizationId : "";
            const editedAccount = await accountService.editAccountManagement(req.body, organizationId, roleName);

            return res.status(200).json({
                "status" : "success",
                "message" : `account ${(await editedAccount).accountId} edited`,
                "data" : editedAccount
            })

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
}


export default AccountController;