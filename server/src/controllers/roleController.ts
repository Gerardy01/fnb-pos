import { Request, Response } from 'express';
import sequelize from "../config/database";

// services
import { rolePermissionService } from '../services';

// exceptions
import { ExistData, DataNotFound, Forbidden } from '../utility/exceptions';

// types and interfaces
import { Transaction } from 'sequelize';

class RoleController {

    static async getAllRole(req : Request, res : Response) {
        try {
            const organizationId = req.user ? req.user.organizationId : "";
            const allRoleData = await rolePermissionService.getAllRole(organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : allRoleData,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "success",
                    "message" : e.message,
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

    static async getAllRoleWithCount(req : Request, res : Response) {
        try {
            const organizationId = req.user ? req.user.organizationId : "";
            const allRoleData = await rolePermissionService.getAllRoleWithCount(organizationId);
            console.log(allRoleData)
            return res.status(200).json({
                "status" : "success",
                "data" : allRoleData,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "success",
                    "message" : e.message,
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

    static async getDefaultRole(req : Request, res : Response) {

        try {
            const userRole = req.user ? req.user.accountRoleName : "";
            const defaultRoles = await rolePermissionService.getDefaultRole(userRole);

            return res.status(200).json({
                "status" : "success",
                "data" : defaultRoles,
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "success",
                    "message" : e.message,
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

    static async getOneRole(req : Request, res : Response) {
        
        try {
            const roleId : number = parseInt(req.params.id);
            const organizationId = req.user ? req.user.organizationId : "";
            const userRole = req.user ? req.user.accountRoleName : "";
    
            const roleData = await rolePermissionService.getOneRoleWithPermission(roleId, organizationId, userRole);

            return res.status(200).json({
                "status" : "success",
                "data" : roleData
            });

        } catch(e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : "Make sure you select correct role.",
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
    
    static async createRole(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {
            const organizationId = req.user ? req.user.organizationId : "";
            const newRole = await rolePermissionService.createRole(req.body, organizationId, transaction);
            
            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "role created",
                "userMessage" : "",
                "data" : newRole,
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
                    "userMessage" : "Make sure you select exist permission",
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

    static async editRole(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {
            const organizationId = req.user ? req.user.organizationId : "";
            const newRole = await rolePermissionService.editRole(req.body, organizationId, transaction);
            
            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "role edited",
                "userMessage" : "",
                "data" : newRole,
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
                    "userMessage" : "Make sure you select exist permission",
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

    static async removeRole(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            await rolePermissionService.deleteRole(Number(req.params.id), organizationId, transaction);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "role deleted",
                "userMessage" : "",
            });

        } catch(e) {

            transaction.rollback();

            if (e instanceof Forbidden) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : e.message,
                    "userMessage" : e.message,
                });
            }

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status" : "success",
                    "message" : e.message,
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
}

export default RoleController;