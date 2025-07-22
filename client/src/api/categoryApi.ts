import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { CategoryDataReturn, CreateCategoryBodyData, EditCategoryBodyData } from "../models/categoryInterface";


export class CategoryApi {
    async getAllCategory() : Promise<[undefined, CategoryDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<CategoryDataReturn[]>>(
            "category"
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneCategory(categoryId : number) : Promise<[undefined, CategoryDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<CategoryDataReturn>>(
            `category/${categoryId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createCategory(data : CreateCategoryBodyData) : Promise<[undefined, CategoryDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<CategoryDataReturn>>(
            "category/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editCategory(data : EditCategoryBodyData) : Promise<[undefined, CategoryDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<CategoryDataReturn>>(
            "category/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteCategory(categoryId : number) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `category/${categoryId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}