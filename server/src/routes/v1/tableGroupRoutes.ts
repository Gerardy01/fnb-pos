import { Router } from "express";

// utils
import { PermissionEnum } from '../../utility/enums';

// middlewares
import { authenticate, validatePermission, validateRequest } from '../../utility/middleware';

// schema
import { ChangeTableGroupStatusSchema, CreateTableGroupSchema, EditTableGroupSchema } from "../../schema/tableSchema";

// controllers
import TableGroupController from "../../controllers/tableGroupController";

const tableGroupRoutes = Router();

tableGroupRoutes.get("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'read'),
    TableGroupController.getAllTableGroup
);
tableGroupRoutes.get("/:id",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'read'),
    TableGroupController.getOneTableGroup
);
tableGroupRoutes.post("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(CreateTableGroupSchema),
    TableGroupController.createTableGroup
);
tableGroupRoutes.put("/",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(EditTableGroupSchema),
    TableGroupController.editTableGroup
);
tableGroupRoutes.put("/action/change-status",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    validateRequest(ChangeTableGroupStatusSchema),
    TableGroupController.changeTableGroupStatus
);
tableGroupRoutes.delete("/:id",
    authenticate,
    validatePermission(PermissionEnum.TABLE_MANAGEMENT, 'write'),
    TableGroupController.deleteTableGroup
);

export default tableGroupRoutes;