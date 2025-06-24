import { Request, Response } from 'express';
import sequelize from '../config/database';

// utils
import { DataNotFound, ExistData } from '../utility/exceptions';

// services
import { tableService } from '../services';

// types and interfaces
import { Transaction } from 'sequelize';


class TableController {
    static async getAllTable(req : Request, res : Response) {

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const tableGroupId = req.query.tableGroupId as number | undefined;
            const tables = await tableService.getAllTable(organizationId, tableGroupId);

            return res.status(200).json({
                "status" : "success",
                "data" : tables,
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

    static async getOneTable(req : Request, res : Response) {

        try {

            const tableId : number = Number(req.params.id);
            const organizationId = req.user ? req.user.organizationId : "";
            const tableData = await tableService.getOneTable(tableId, organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : tableData,
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

    static async createTable(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newTable = await tableService.createTable(req.body, organizationId, transaction);
            
            transaction.commit();

            return res.status(201).json({
                "status" : "success",
                "message" : "Table created",
                "userMessage" : "",
                "data" : newTable,
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

    static async editTable(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();
        
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedTable = await tableService.editTable(req.body, organizationId);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "Table edited",
                "userMessage" : "",
                "data" : editedTable,
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

    static async deleteTable(req : Request, res : Response) {
        const transaction : Transaction = await sequelize.transaction();

        try {

            const tableId : number = Number(req.params.id);
            const organizationId = req.user ? req.user.organizationId : "";
            const tableDeleted = await tableService.deleteTable(tableId, organizationId);

            transaction.commit();

            return res.status(200).json({
                "status" : "success",
                "message" : "table deleted",
                "userMessage" : "",
                "data" : tableDeleted,
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

    static async changeTableStatus(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newStatus = await tableService.changeTableStatus(req.body, organizationId);

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

export default TableController;