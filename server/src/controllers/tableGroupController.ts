import { Request, Response } from 'express';
import sequelize from '../config/database';

// utils
import { DataNotFound, ExistData } from '../utility/exceptions';

// services
import { tableService } from '../services';

// types and interfaces
import { Transaction } from 'sequelize';


class TableGroupController {
    static async getAllTableGroup(req : Request, res : Response) {

        try {
            
            const organizationId = req.user ? req.user.organizationId : "";
            const outletId = req.query.outletId as string | undefined;
            const tableGroups = await tableService.getAllTableGroup(organizationId, outletId);

            return res.status(200).json({
                "status" : "success",
                "data" : tableGroups,
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

    static async getOneTableGroup(req : Request, res : Response) {

        try {

            const tableGroupId : number = Number(req.params.id);
            const organizationId = req.user ? req.user.organizationId : "";
            const tableGroupData = await tableService.getOneTableGroup(tableGroupId, organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : tableGroupData,
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

    static async createTableGroup(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();
        
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newTableGroup = await tableService.createTableGroup(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "Table group created",
                "userMessage" : "",
                "data" : newTableGroup,
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

    static async editTableGroup(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedTableGroup = await tableService.editTableGroup(req.body, organizationId, transaction);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "Table group edited",
                "userMessage" : "",
                "data" : editedTableGroup,
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

    static async deleteTableGroup(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const tableGroupId : number = Number(req.params.id);
            const organizationId = req.user ? req.user.organizationId : "";
            const tableGroupDeleted = await tableService.deleteTableGroup(tableGroupId, organizationId, transaction);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "table group deleted",
                "userMessage" : "",
                "data" : tableGroupDeleted,
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

            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }

    static async changeTableGroupStatus(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newStatus = await tableService.changeTableGroupStatus(req.body, organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "status changed",
                "userMessage" : "",
                "data" : {
                    "newStatus" : newStatus
                },
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

export default TableGroupController;