import { Request, Response } from 'express';
import sequelize from "../config/database";

// services
import { organizationService, organizationAccountService } from '../services';

// exceptions
import { ExistData, DataNotFound, WrongFormat } from '../utility/exceptions';

// types and interfaces
import { Transaction  } from 'sequelize';


class OrganizationController {
    async createOrganization(req : Request, res : Response) {
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
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }

    async createOrganizationWithAccount(req : Request, res : Response) {
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

export default new OrganizationController();