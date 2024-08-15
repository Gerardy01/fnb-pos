import { Request, Response } from 'express';

// services
import { organizationService } from '../services';

// exceptions
import { NotEpoch } from '../utility/exceptions';


class OrganizationController {
    async createOrganization(req : Request, res : Response) {
        try {
            const newOrganization = await organizationService.createOrganization(req.body);

            return res.status(201).json({
                "status" : "success",
                "message" : "organization created",
                "userMessage" : "",
                "data" : newOrganization,
            });

        } catch(e) {

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