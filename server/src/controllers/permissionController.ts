import { Request, Response } from 'express';

// services
import { rolePermissionService } from '../services';

// exceptions
import { DataNotFound } from '../utility/exceptions';



class PermissionController {
    static async getAllPermission(req : Request, res : Response) {
        try {
            const allPermissions = await rolePermissionService.getAllPermission();

            return res.status(200).json({
                "status" : "success",
                "data" : allPermissions,
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

    static async getAllPageAccessPermission(req : Request, res : Response) {
        try {
            const allPageAccessPermission = await rolePermissionService.getAllPageAccessPermission();

            return res.status(200).json({
                "status" : "success",
                "data" : allPageAccessPermission,
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
}

export default PermissionController