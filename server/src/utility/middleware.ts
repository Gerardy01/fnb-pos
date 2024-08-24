import { Request, Response, NextFunction } from 'express';

// services
import { authService } from '../services';

// types and interfaces
import { IZodErrorMessage } from '../interfaces/IUtility';

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
            "condition" : "failed",
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
            "condition" : "failed",
            "message" : "bad request, not authenticated",
            "userMessage" : "",
        });
    }
    
}