import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// schema
import { CreateCategorySchema, EditCategorySchema } from "../../schema/categorySchema";

// controllers
import CategoryController from "../../controllers/categoryController";

const categoryRoutes = Router();

categoryRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.CATEGORY_MANAGEMENT, 'read'),
    CategoryController.getAllCategory
);
categoryRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.CATEGORY_MANAGEMENT, 'read'),
    CategoryController.getOneCategory
);
categoryRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.CATEGORY_MANAGEMENT, 'write'),
    validateRequest(CreateCategorySchema),
    CategoryController.createCategory
);
categoryRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.CATEGORY_MANAGEMENT, 'write'),
    validateRequest(EditCategorySchema),
    CategoryController.editCategory
);
categoryRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.CATEGORY_MANAGEMENT, 'write'),
    CategoryController.deleteCategory
);

export default categoryRoutes;
