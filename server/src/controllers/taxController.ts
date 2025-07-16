import { Request, Response } from 'express';
import sequelize from '../config/database';

// utils
import { DataNotFound, ExistData, Forbidden } from '../utility/exceptions';

// services
import { taxService } from '../services';

// types and interfaces
import { Transaction } from 'sequelize';


class TaxController {
    static async getAllTax(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const taxData = await taxService.getAllTax(organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : taxData,
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

    static async getAllTaxComplete(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const taxData = await taxService.getAllTaxComplete(organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : taxData,
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

    static async getOneTax(req : Request, res : Response) {
        try {

            const taxId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const taxData = await taxService.getOneTax(Number(taxId), organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : taxData,
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

    static async createTax(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newTax = await taxService.createTax(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "Tax created",
                "userMessage" : "",
                "data" : newTax,
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

    static async editTax(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedTax = await taxService.editTax(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "Tax edited",
                "userMessage" : "",
                "data" : editedTax,
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

    static async deleteTax(req : Request, res : Response) {
        try {

            const taxId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const deleted = await taxService.deleteTax(Number(taxId), organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "sales type deleted",
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

export default TaxController;