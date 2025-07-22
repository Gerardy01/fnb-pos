


export interface CategoryDataReturn {
    categoryId : number;
    name : string;
    itemCount? : number;
}

export interface CreateCategoryBodyData {
    name : string;
}

export interface EditCategoryBodyData {
    categoryId : number;
    name : string;
}