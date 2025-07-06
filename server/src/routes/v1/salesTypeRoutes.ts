import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// schema
import { CreateSalesTypeSchema } from "../../schema/salesTypeSchema";

// controllers
import SalesTypeController from "../../controllers/salesTypeController";

const salesTypeRoutes = Router();

salesTypeRoutes.get("/action/complete",
    authenticate,
    validatePermission(PermissionEnum.SALES_TYPE_MANAGEMENT, 'read'),
    SalesTypeController.getAllSalesTypeComplete
);
salesTypeRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.SALES_TYPE_MANAGEMENT, 'write'),
    validateRequest(CreateSalesTypeSchema),
    SalesTypeController.createSalesType
);

export default salesTypeRoutes;