import { Request, Response } from 'express';
import sequelize from '../config/database';

// utils
import { DataNotFound, ExistData, Forbidden } from '../utility/exceptions';

// services
import { gratuityService } from '../services';

// types and interfaces
import { Transaction } from 'sequelize';


class GratuityController {
    static async getAllGratuity(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const gratuityData = await gratuityService.getAllGratuity(organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : gratuityData,
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

    static async getOneGratuity(req : Request, res : Response) {
        try {

            const gratuityId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const gratuityData = await gratuityService.getOneGratuity(Number(gratuityId), organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : gratuityData,
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

    static async createGratuity(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newGratuity = await gratuityService.createGratuity(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "Gratuity created",
                "userMessage" : "",
                "data" : newGratuity,
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

    static async editGratuity(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedGratuity = await gratuityService.editGratuity(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "outlet edited",
                "userMessage" : "",
                "data" : editedGratuity,
            });

        } catch(e) {

            transaction.rollback();

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

    static async deleteGratuity(req : Request, res : Response) {
        try {

            const gratuityId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const deleted = await gratuityService.deleteGratuity(Number(gratuityId), organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "outlet deleted",
                "userMessage" : "",
                "data" : deleted,
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

export default GratuityController;