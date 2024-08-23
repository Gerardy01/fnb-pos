import { Request, Response, NextFunction } from 'express';

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
                "condition" : "failed",
                "message" : "bad request",
                "userMessage" : "",
                "errors" : errors
            });
        }

        next();
    }
}

export function authenticate(req : Request, res : Response) {
    
}