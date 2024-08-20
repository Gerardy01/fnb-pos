import { Router } from 'express';


// routes
import authRoutes from './authRoutes';
import accountRoutes from './accountRoutes';
import organizationRoutes from './organizationRoutes';
import roleRoutes from './roleRoutes';


const v1Api = Router();

v1Api.use("/", authRoutes);
v1Api.use("/account", accountRoutes);
v1Api.use("/organization", organizationRoutes);
v1Api.use("/role", roleRoutes);


export default v1Api;