import { Router } from 'express';

// middlewares
import { validateRequest } from '../../utility/middleware';

// schema
import { CreateRoleSchema } from '../../schema/roleSchema';

// controllers
import RoleController from '../../controllers/roleController';

const roleRoutes = Router();

roleRoutes.post("/", validateRequest(CreateRoleSchema), RoleController.createRole);

export default roleRoutes;