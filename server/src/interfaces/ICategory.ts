


export interface ICreateCategoryData {
    name : string;
}

export interface IEditCategoryData {
    categoryId : number;
    name : string;
}

export type CategoryReturnData = {
    categoryId : number;
    name : string;
    itemCount? : number
}