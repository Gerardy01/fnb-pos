import { Request, Response } from 'express';

// services
import { outletService } from '../services';

// exceptions
import { ExistData } from '../utility/exceptions';


class OutletController {

    static async getAllOutlet(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const outletData = await outletService.getAllOutlet(organizationId);

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

    static async createOutlet(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newOutlet = await outletService.createOutlet(req.body, organizationId);

            return res.status(201).json({
                "status" : "success",
                "message" : "outlet created",
                "userMessage" : "",
                "data" : newOutlet,
            });

        } catch(e) {

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

}

export default OutletController;