import { Request, Response, NextFunction } from 'express';

// services
import { authService } from '../services';

// types and interfaces
import { IZodErrorMessage } from '../interfaces/IUtility';
import { IRolePermissionData } from '../interfaces/IRole';

export function validateRequest(Schema : any) {
    return async (req : Request, res : Response, next : NextFunction) => {
        const result = Schema.safeParse(req.body);

        if (!result.success) {

            let errors : any = result.error.errors;
            try {
                const errorList : IZodErrorMessage[] = [];
                result.error.errors.forEach((item : any) => {
                    errorList.push({
                        field: item.path[0],
                        message: item.message
                    });
                });
                errors = errorList;
            } catch(e) {}

            return res.status(400).json({
                "status" : "failed",
                "message" : "bad request",
                "userMessage" : "",
                "errors" : errors
            });
        }

        next();
    }
}

export async function authenticate(req : Request, res : Response, next : NextFunction) {

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            "status" : "failed",
            "message" : "bad request, not authenticated",
            "userMessage" : "",
        });
    }

    try {
        const tokenData = await authService.authenticate(token);
        req.user = tokenData
        
        next();
    } catch(e) {
        return res.status(401).json({
            "status" : "failed",
            "message" : "bad request, not authenticated",
            "userMessage" : "",
        });
    }
    
}

export function validatePermission(permission : number, action : 'read' | 'write') {
    return async (req : Request, res : Response, next : NextFunction) => {
        try {

            if (!req.user) return;
    
            const permissions : IRolePermissionData[] = req.user.permissions;
    
            const permissionAvailable : IRolePermissionData | undefined = permissions.find(item => item.permissionId === permission);
    
            if (!permissionAvailable) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : "no valid permission",
                    "userMessage" : "",
                    "errors" : {
                        "permissionCode" : permission,
                        "action" : action
                    }
                });
            }
    
            let gotPermission : boolean = false;
            if (action === 'read') gotPermission = permissionAvailable.read;
            if (action === 'write') gotPermission = permissionAvailable.write;
    
            if (!gotPermission) {
                return res.status(403).json({
                    "status" : "failed",
                    "message" : "no valid permission",
                    "userMessage" : "",
                    "errors" : {
                        "permissionCode" : permission,
                        "action" : action
                    }
                });
            }
    
            next();
        } catch(e) {
            return res.status(500).json({
                "status" : "failed",
                "message" : "server error",
                "userMessage" : "Something wrong. Try again later.",
                "errors" : e
            });
        }
    }
}