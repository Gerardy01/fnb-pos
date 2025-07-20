
// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { CategoryReturnData, ICreateCategoryData } from "../interfaces/ICategory"
import { ICategoryRepository } from "../repositories/categoryRepository"

export interface ICategoryService {
    getAllCategory(organizationId : string, includeItemCount? : boolean) : Promise<CategoryReturnData[]>
    createCategory(data : ICreateCategoryData, organizationId : string) : Promise<CategoryReturnData>
}


export class CategoryService implements ICategoryService {
    constructor(
        private categoryRepository : ICategoryRepository,
    ) {}

    async getAllCategory(organizationId: string, includeItemCount : boolean = false): Promise<CategoryReturnData[]> {
        
        const categories = await this.categoryRepository.findCategoryByOrganization(organizationId);

        const categoryList : CategoryReturnData[] = [];
        categories.forEach(item => {
            categoryList.push({
                categoryId : item.category_id,
                name : item.name,
            });
        });

        return categoryList;
    }

    async createCategory(data: ICreateCategoryData, organizationId: string): Promise<CategoryReturnData> {

        // check name exist
        const nameExist = await this.categoryRepository.findCategoryByOrganizationAndName(organizationId, data.name);
        if (nameExist) throw new ExistData("CATEGORY409-1");

        const newCategory = await this.categoryRepository.createCategory({
            name : data.name,
            organization_id : organizationId,
        });
        
        return {
            categoryId : newCategory.category_id,
            name : data.name
        }
    }
}