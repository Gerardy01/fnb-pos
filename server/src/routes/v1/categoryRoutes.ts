import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// schema
import { CreateCategorySchema } from "../../schema/categorySchema";

// controllers
import CategoryController from "../../controllers/categoryController";

const categoryRoutes = Router();

categoryRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.CATEGORY_MANAGEMENT, 'read'),
    CategoryController.getAllCategory
);
categoryRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.CATEGORY_MANAGEMENT, 'write'),
    validateRequest(CreateCategorySchema),
    CategoryController.createCategory
);

export default categoryRoutes;
