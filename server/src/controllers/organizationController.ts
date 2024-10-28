import { Request, Response } from 'express';
import sequelize from "../config/database";

// services
import { organizationService, organizationAccountService } from '../services';

// exceptions
import { ExistData, DataNotFound, WrongFormat } from '../utility/exceptions';

// types and interfaces
import { Transaction  } from 'sequelize';


class OrganizationController {

    static async getUserOrganization(req : Request, res : Response) {

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const organizationInfo = await organizationService.getOrganizationInfo(organizationId);
            
            return res.status(200).json({
                "status" : "success",
                "message" : "info retrived",
                "userMessage" : "",
                "data" : organizationInfo
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : "ACCOUNT404", // Account not found.
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

    static async createOrganization(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();
        
        try {
            const newOrganization = await organizationService.createOrganization(req.body, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "organization created",
                "userMessage" : "",
                "data" : newOrganization,
            });

        } catch(e) {

            transaction.rollback();

            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "500",
                "errors" : e
            });
        }
    }

    static async createOrganizationWithAccount(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const newOrganization = await organizationAccountService.createOrganizationWithAccount(req.body, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "organization created",
                "userMessage" : "",
                "data" : newOrganization,
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

export default OrganizationController;