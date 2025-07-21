import { Request, Response } from 'express';
import sequelize from '../config/database';

// utils
import { DataNotFound, ExistData } from '../utility/exceptions';

// services
import { categoryService } from '../services';

// types and interfaces
import { Transaction } from 'sequelize';



class CategoryController {
    static async getAllCategory(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const categoryData = await categoryService.getAllCategory(organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : categoryData,
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

    static async getOneCategory(req : Request, res : Response) {
        try {

            const categoryId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const categoryData = await categoryService.getOneCategory(Number(categoryId), organizationId);

            return res.status(200).json({
                "status" : "success",
                "data" : categoryData,
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

    static async createCategory(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const newCategory = await categoryService.createCategory(req.body, organizationId);
            
            return res.status(201).json({
                "status" : "success",
                "message" : "New category created",
                "userMessage" : "",
                "data" : newCategory,
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

    static async editCategory(req : Request, res : Response) {
        try {

            const organizationId = req.user ? req.user.organizationId : "";
            const editedCategory = await categoryService.editCategory(req.body, organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "Category edited",
                "userMessage" : "",
                "data" : editedCategory,
            });

        } catch(e) {
            
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

    static async deleteCategory(req : Request, res : Response) {
        try {

            const categoryId : string = req.params.id;
            const organizationId = req.user ? req.user.organizationId : "";
            const deleted = await categoryService.deleteCategory(Number(categoryId), organizationId);

            return res.status(200).json({
                "status" : "success",
                "message" : "sales type deleted",
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

export default CategoryController;