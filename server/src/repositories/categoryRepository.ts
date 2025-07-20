import { Op, Transaction } from "sequelize";
import { Category } from "../models";


export interface ICategoryRepository {
    findCategoryById(categoryId : number) : Promise<Category | null>
    findCategoryByOrganization(organizationId : string) : Promise<Category[]>
    findCategoryByOrganizationAndName(organizationId : string, name : string) : Promise<Category | null>
    createCategory(data : Partial<Category>, transaction? : Transaction) : Promise<Category>
}

export class CategoryRepository implements ICategoryRepository {
    findCategoryById(categoryId: number): Promise<Category | null> {
        return Category.findOne({
            where: {
                category_id : categoryId,
                archived : false,
            }
        });
    }

    findCategoryByOrganization(organizationId: string): Promise<Category[]> {
        return Category.findAll({
            where: {
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    findCategoryByOrganizationAndName(organizationId: string, name: string): Promise<Category | null> {
        return Category.findOne({
            where: {
                name : {
                    [Op.iLike] : name,
                },
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    createCategory(data: Partial<Category>, transaction?: Transaction): Promise<Category> {
        return Category.create(data, { transaction });
    }
}