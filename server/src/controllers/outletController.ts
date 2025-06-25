import { Request, Response } from 'express';
import sequelize from '../config/database';

// services
import { outletService } from '../services';

// exceptions
import { DataNotFound, ExistData, Forbidden } from '../utility/exceptions';

// types and interfaces
import { Transaction } from 'sequelize';


class OutletController {

    static async getAllOutlet(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const accountId = req.query.accountId as string | undefined;
            const outletData = await outletService.getAllOutlet(organizationId, accountId);

            return res.status(200).json({
                "status" : "success",
                "data" : outletData,
            });

        } catch(e) {
            
            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }

    static async getOneOutlet(req : Request, res : Response) {
        try {

            const outletId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const outletData = await outletService.getOneOutlet(outletId, organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : outletData,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
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

    static async createOutlet(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newOutlet = await outletService.createOutlet(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "outlet created",
                "userMessage" : "",
                "data" : newOutlet,
            });

        } catch(e) {

            transaction.rollback();

            if (e instanceof ExistData) {
                return res.status(409).json({
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

    static async editOutlet(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedOutlet = await outletService.editOutlet(req.body, organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "outlet edited",
                "userMessage" : "",
                "data" : editedOutlet,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof ExistData) {
                return res.status(409).json({
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

    static async deleteOutlet(req : Request, res : Response) {
        try {
            
            const outletId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const deleteUnder = req.query.deleteUnder as string | undefined;
            const outletDeleted = await outletService.deleteOutlet(outletId, organizationId, deleteUnder);

            return res.status(200).json({
                "status" : "success",
                "message" : "outlet deleted",
                "userMessage" : "",
                "data" : outletDeleted,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof Forbidden) {
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

    static async changeOutletStatus(req : Request, res : Response) {
        try {
            
            const organizationId = req.user ? req.user.organizationId : "";
            const newStatus = await outletService.changeOutletStatus(req.body, organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "status changed",
                "userMessage" : "",
                "data" : {
                    "newStatus" : newStatus
                },
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
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

export default OutletController;