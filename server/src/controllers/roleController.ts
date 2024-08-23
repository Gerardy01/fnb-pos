import { Request, Response } from 'express';
import sequelize from "../config/database";

// services
import { roleService } from '../services';

// exceptions
import { ExistData, DataNotFound, DuplicateValue } from '../utility/exceptions';

// types and interfaces
import { Transaction } from 'sequelize';

class RoleController {
    static async createRole(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {
            const newRole = await roleService.createRole(req.body, "17298527-f68d-4b9c-b049-5e775f14b15b", transaction);
            
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

            if (e instanceof DuplicateValue) {
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

export default RoleController;