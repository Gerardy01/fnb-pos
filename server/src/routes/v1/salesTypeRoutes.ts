import { Router } from "express";

// utils
import { PermissionEnum } from "../../utility/enums";

// middlewares
import { authenticate, validatePermission, validateRequest } from "../../utility/middleware";

// schema
import { CreateSalesTypeSchema, EditSalesTypeSchema } from "../../schema/salesTypeSchema";

// controllers
import SalesTypeController from "../../controllers/salesTypeController";

const salesTypeRoutes = Router();

salesTypeRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.SALES_TYPE_MANAGEMENT, 'read'),
    SalesTypeController.getAllSalesType
);
salesTypeRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.SALES_TYPE_MANAGEMENT, 'read'),
    SalesTypeController.getOneSalesType
);
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
salesTypeRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.SALES_TYPE_MANAGEMENT, 'write'),
    validateRequest(EditSalesTypeSchema),
    SalesTypeController.editSalesType
);
salesTypeRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.SALES_TYPE_MANAGEMENT, 'write'),
    SalesTypeController.deleteSalesType
);

export default salesTypeRoutes;