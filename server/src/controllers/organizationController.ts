import { Request, Response } from 'express';
import sequelize from "../config/database";

// services
import { organizationService } from '../services';

// exceptions
import { NotEpoch } from '../utility/exceptions';
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

            if (e instanceof NotEpoch) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : "make sure epoch value is valid",
                    "userMessage" : "",
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

    async createOrganizationWithAccount(req : Request, res : Response) {
        try {
            res.send("success")
        } catch(e) {
            res.send("something wrong")
        }
    }
}

export default new OrganizationController();