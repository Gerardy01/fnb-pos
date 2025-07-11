import { Request, Response } from 'express';
import sequelize from '../config/database';

// utils
import { DataNotFound, ExistData } from '../utility/exceptions';

// services
import { salesTypeService } from '../services';

// types and interfaces
import { Transaction } from 'sequelize';



class SalesTypeController {
    static async getAllSalesType(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const salesTypes = await salesTypeService.getAllSalesType(organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : salesTypes,
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

    static async getOneSalesType(req : Request, res : Response) {
        try {

            const salesTypeId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const salestypeData = await salesTypeService.getOneSalesType(Number(salesTypeId), organizationId)
            
            return res.status(200).json({
                "status" : "success",
                "data" : salestypeData,
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

    static async getAllSalesTypeComplete(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const salesTypes = await salesTypeService.getAllSalesTypeComplete(organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : salesTypes,
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

    static async createSalesType(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newSalesType = await salesTypeService.createSalesType(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "Sales type created",
                "userMessage" : "",
                "data" : newSalesType,
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

    static async editSalesType(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedSalesType = await salesTypeService.editSalesType(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "Sales type edited",
                "userMessage" : "",
                "data" : editedSalesType,
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

    static async deleteSalesType(req : Request, res : Response) {
        try {

            const salesTypeId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const deleted = await salesTypeService.deleteSalesType(Number(salesTypeId), organizationId);

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

export default SalesTypeController;