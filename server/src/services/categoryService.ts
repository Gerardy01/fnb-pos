
// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { CategoryReturnData, ICreateCategoryData, IEditCategoryData } from "../interfaces/ICategory"
import { ICategoryRepository } from "../repositories/categoryRepository"

export interface ICategoryService {
    getAllCategory(organizationId : string, includeItemCount? : boolean) : Promise<CategoryReturnData[]>
    getOneCategory(categoryId : number, organizationId : string) : Promise<CategoryReturnData>
    createCategory(data : ICreateCategoryData, organizationId : string) : Promise<CategoryReturnData>
    editCategory(data : IEditCategoryData, organizationId : string) : Promise<CategoryReturnData>
    deleteCategory(categoryId : number, organizationId : string) : Promise<boolean>
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

    async getOneCategory(categoryId: number, organizationId: string): Promise<CategoryReturnData> {
        
        const category = await this.categoryRepository.findCategoryById(categoryId);
        if (!category || category.organization_id !== organizationId) throw new DataNotFound("Data not found");

        return {
            categoryId : category.category_id,
            name : category.name,
        }
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

    async editCategory(data: IEditCategoryData, organizationId: string): Promise<CategoryReturnData> {

        // check category exist
        const targetCategory = await this.categoryRepository.findCategoryById(data.categoryId);
        if (!targetCategory || targetCategory.organization_id !== organizationId) throw new DataNotFound("Data not found");
        
        // check name exist
        const nameExist = await this.categoryRepository.findCategoryByOrganizationAndName(organizationId, data.name);
        if (nameExist && nameExist.category_id !== targetCategory.category_id) throw new ExistData("CATEGORY409-1");

        targetCategory.name = data.name;

        await targetCategory.save();

        return {
            categoryId : targetCategory.category_id,
            name : targetCategory.name,
        }
    }

    async deleteCategory(categoryId: number, organizationId: string): Promise<boolean> {
        
        const targetCategory = await this.categoryRepository.findCategoryById(categoryId);
        if (!targetCategory || targetCategory.organization_id !== organizationId) throw new DataNotFound("Data not found");

        targetCategory.archived = true;

        targetCategory.save();

        return true;
    }
}