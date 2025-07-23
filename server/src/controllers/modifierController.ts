import { Request, Response } from 'express';
import sequelize from '../config/database';

// utils
import { DataNotFound, ExistData, Forbidden, NotValid } from '../utility/exceptions';

// services
import { modifierService } from '../services';

// types and interfaces
import { Transaction } from 'sequelize';


class ModifierController {
    static async getAllModifier(req : Request, res : Response) {
        try {

            const includeOptions = req.query.includeOptions as string | undefined;
            const organizationId = req.user ? req.user.organizationId : "";
            const modifiers = await modifierService.getAllModifier(organizationId, includeOptions);

            return res.status(200).json({
                "status" : "success",
                "data" : modifiers,
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

    static async getOneModifier(req : Request, res : Response) {
        try {

            const modifierId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const modifierData = await modifierService.getOneModifier(Number(modifierId), organizationId);
            
            return res.status(200).json({
                "status" : "success",
                "data" : modifierData,
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

    static async createModifier(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newModifier = await modifierService.createModifier(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "Modifier created",
                "userMessage" : "",
                "data" : newModifier,
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

            if (e instanceof NotValid) {
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

    static async editModifier(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedModifier = await modifierService.editModifier(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "Modifier edited",
                "userMessage" : "",
                "data" : editedModifier,
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

            if (e instanceof NotValid) {
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

    static async deleteModifier(req : Request, res : Response) {

        try {

            const modifierId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const deleted = await modifierService.deleteModifier(Number(modifierId), organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "Modifier deleted",
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

export default ModifierController;