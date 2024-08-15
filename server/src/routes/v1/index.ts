import { Router } from 'express';


// routes
import accountRoutes from './accountRoutes';
import organizationRoutes from './organizationRoutes';


const v1Api = Router();

v1Api.use("/account", accountRoutes);
v1Api.use("/organization", organizationRoutes);


export default v1Api;