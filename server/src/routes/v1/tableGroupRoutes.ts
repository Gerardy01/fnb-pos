import { Router } from "express";

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { CreateTableGroupSchema } from "../../schema/tableSchema";

// controllers
import TableGroupController from "../../controllers/tableGroupController";

const tableGroupRoutes = Router();

tableGroupRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'read'),
    TableGroupController.getAllTableGroup
);
tableGroupRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(CreateTableGroupSchema),
    TableGroupController.createTableGroup
);

export default tableGroupRoutes;