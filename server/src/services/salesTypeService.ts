

// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import { AssignedGratuities, ICreateSalesTypeData, IEditSalesTypeData, SalesTypeCompleteReturnData, SalesTypeReturnData } from "../interfaces/ISalesType";
import { ISalesTypeRepository } from "../repositories/salesTypeRepository";
import { IOutletRepository } from "../repositories/outletRepository";
import { IGratuityRepository } from "../repositories/gratuityRepository";
import { ISalesTypeOutletRepository } from "../repositories/salesTypeOutletRepository";
import SalesTypeOutlets from "../models/salesTypeOutlet.model";
import { SalesTypeGratuity } from "../models";
import { ISalesTypeGratuityRepository } from "../repositories/salesTypeGratuityRepository";
export interface ISalesTypeService {
    getAllSalesType(organizationId : string) : Promise<SalesTypeReturnData[]>
    getOneSalesType(salesTypeId : number, organizationId : string) : Promise<SalesTypeCompleteReturnData>
    getAllSalesTypeComplete(organizationId : string) : Promise<SalesTypeCompleteReturnData[]>
    createSalesType(data : ICreateSalesTypeData, organizationId : string, transaction? : Transaction) : Promise<SalesTypeCompleteReturnData>
    editSalesType(data : IEditSalesTypeData, organizationId : string, transaction? : Transaction) : Promise<SalesTypeCompleteReturnData>
}


export class SalesTypeService implements ISalesTypeService {
    constructor(
        private salesTypeRepository : ISalesTypeRepository,
        private outletRepository : IOutletRepository,
        private gratuityRepository : IGratuityRepository,
        private salesTypeOutletRepository : ISalesTypeOutletRepository,
        private salesTypeGratuityRepository : ISalesTypeGratuityRepository,
    ) {}

    async getAllSalesType(organizationId: string): Promise<SalesTypeReturnData[]> {

        const salesTypes = await this.salesTypeRepository.findSalesTypeByOrganization(organizationId);

        const salesTypeList : SalesTypeReturnData[] = [];
        salesTypes.forEach(item => {
            salesTypeList.push({
                salesTypeId : item.sales_type_id,
                name : item.name,
            });
        });

        return salesTypeList;
    }

    async getOneSalesType(salesTypeId: number, organizationId: string): Promise<SalesTypeCompleteReturnData> {
        
        const salestype = await this.salesTypeRepository.findSalesTypeById(salesTypeId);
        if (!salestype || salestype.organization_id !== organizationId) throw new DataNotFound("Data not found");

        const outlets = await this.outletRepository.findOutletBySalesType(salesTypeId, organizationId);
        const outletIds = outlets.map(item => item.outlet_id);

        const gratuities = await this.salesTypeGratuityRepository.findSalesTypeGratuityBySalesType(salesTypeId);

        const assignedGratuities : AssignedGratuities[] = [];
        gratuities.forEach(item => {
            if (item.outlet?.archived) return;
            assignedGratuities.push({
                gratuityId : item.gratuity_id,
                outletId : item.outlet_id, 
            });
        });

        return {
            salesTypeId : salestype.sales_type_id,
            name : salestype.name,
            outletIds : outletIds,
            assignedGratuities : assignedGratuities,
        }
    }

    async getAllSalesTypeComplete(organizationId: string): Promise<SalesTypeCompleteReturnData[]> {

        const salesTypes = await this.salesTypeRepository.findSalesTypeByOrganization(organizationId, true);

        const salesTypeList : SalesTypeCompleteReturnData[] = [];
        salesTypes.forEach(item => {
            const assignedGratuities : AssignedGratuities[] = [];
            item.sales_type_gratuity?.forEach(e => {
                if (e.outlet?.archived) return;
                assignedGratuities.push({
                    gratuityId : e.gratuity_id,
                    outletId : e.outlet_id,
                });
            });

            salesTypeList.push({
                salesTypeId : item.sales_type_id,
                name : item.name,
                outletIds : item.outlets ? item.outlets.map(e => e.outlet_id) : [],
                assignedGratuities : assignedGratuities
            });
        });

        return salesTypeList;
    }

    async createSalesType(data: ICreateSalesTypeData, organizationId : string, transaction?: Transaction): Promise<SalesTypeCompleteReturnData> {

        // check name exist
        const nameExist = await this.salesTypeRepository.findSalesTypeByName(data.name, organizationId);
        if (nameExist) throw new ExistData("SALESTYPE409-1");

        // remove duplicates
        const uniqueOutletIds = new Set(data.outletIds);
        const outletIds = Array.from(uniqueOutletIds);

        // check if all outlet exist
        const outlets = await this.outletRepository.findOutletByIds(outletIds, organizationId);
        const foundOutletIds = outlets.map(outlet => outlet.outlet_id);
        if (foundOutletIds.length !== outletIds.length) {
            const missingOutletIds = outletIds.filter(id => !foundOutletIds.includes(id));
            throw new DataNotFound(`Outlet with id ${missingOutletIds.join(', ')} does not exist`);
        }

        // check if all gratuity exist
        let gratuityIds = data.assignedGratuities.map(item => item.gratuityId);
        const uniqueGratuityIds = new Set(gratuityIds);
        gratuityIds = Array.from(uniqueGratuityIds);
        const gratuities = await this.gratuityRepository.findGratuityByIds(gratuityIds, organizationId);
        const foundGratuityIds = gratuities.map(gratuity => gratuity.gratuity_id);
        if (foundGratuityIds.length !== gratuityIds.length) {
            const missingGratuityIds = gratuityIds.filter(id => !foundGratuityIds.includes(id));
            throw new DataNotFound(`Gratuity with id ${missingGratuityIds.join(', ')} does not exist`);
        }

        // check outlet from gratuities exist
        let outletIdsFromAssigned = data.assignedGratuities.map(item => item.outletId ?? "");
        if (outletIdsFromAssigned.length > 0 && outletIdsFromAssigned[0] !== "") {
            const unique = new Set(outletIdsFromAssigned);
            const uniqueOutletIds = Array.from(unique);
            const outlets = await this.outletRepository.findOutletByIds(uniqueOutletIds, organizationId);
            const foundOutletIds = outlets.map(outlet => outlet.outlet_id);
            if (foundOutletIds.length !== uniqueOutletIds.length) {
                const missingOutletIds = uniqueOutletIds.filter(id => !foundOutletIds.includes(id));
                throw new DataNotFound(`Outlet with id ${missingOutletIds.join(', ')} does not exist`);
            }
        }

        // create sales type
        const createdSalesType = await this.salesTypeRepository.createSalesType({
            name : data.name,
            organization_id : organizationId,
        }, transaction);

        // create sales type's outlet
        const salesTypeOutletList : Partial<SalesTypeOutlets>[] = [];
        outletIds.forEach(item => {
            salesTypeOutletList.push({
                sales_type_id : createdSalesType.sales_type_id,
                outlet_id : item,
            });
        });
        await this.salesTypeOutletRepository.bulkCreateSalesTypeOutlet(salesTypeOutletList, transaction);

        // create sales type's gratuity
        const salesTypeGratuityList : Partial<SalesTypeGratuity>[] = [];
        data.assignedGratuities.forEach(item => {
            salesTypeGratuityList.push({
                sales_type_id : createdSalesType.sales_type_id,
                gratuity_id : item.gratuityId,
                outlet_id : item.outletId ? item.outletId : undefined,
            });
        });
        await this.salesTypeGratuityRepository.bulkCreateSalesTypeGratuity(salesTypeGratuityList, transaction);

        return {
            salesTypeId : createdSalesType.sales_type_id,
            name : createdSalesType.name,
            outletIds : outletIds,
            assignedGratuities : data.assignedGratuities,
        }
    }

    async editSalesType(data: IEditSalesTypeData, organizationId: string, transaction?: Transaction): Promise<SalesTypeCompleteReturnData> {

        // check sales type exist
        const targetSalesType = await this.salesTypeRepository.findSalesTypeById(data.salesTypeId);
        if (!targetSalesType || targetSalesType.organization_id !== organizationId) throw new DataNotFound("Data not found");
        
        // check name exist
        const nameExist = await this.salesTypeRepository.findSalesTypeByName(data.name, organizationId);
        if (nameExist && nameExist.sales_type_id !== targetSalesType.sales_type_id) throw new ExistData("SALESTYPE409-1");

        // remove duplicates
        const uniqueOutletIds = new Set(data.outletIds);
        const outletIds = Array.from(uniqueOutletIds);

        // check if all outlet exist
        const outlets = await this.outletRepository.findOutletByIds(outletIds, organizationId);
        const foundOutletIds = outlets.map(outlet => outlet.outlet_id);
        if (foundOutletIds.length !== outletIds.length) {
            const missingOutletIds = outletIds.filter(id => !foundOutletIds.includes(id));
            throw new DataNotFound(`Outlet with id ${missingOutletIds.join(', ')} does not exist`);
        }

        // check if all gratuity exist
        let gratuityIds = data.assignedGratuities.map(item => item.gratuityId);
        const uniqueGratuityIds = new Set(gratuityIds);
        gratuityIds = Array.from(uniqueGratuityIds);
        const gratuities = await this.gratuityRepository.findGratuityByIds(gratuityIds, organizationId);
        const foundGratuityIds = gratuities.map(gratuity => gratuity.gratuity_id);
        if (foundGratuityIds.length !== gratuityIds.length) {
            const missingGratuityIds = gratuityIds.filter(id => !foundGratuityIds.includes(id));
            throw new DataNotFound(`Gratuity with id ${missingGratuityIds.join(', ')} does not exist`);
        }

        // check outlet from gratuities exist
        let outletIdsFromAssigned = data.assignedGratuities.map(item => item.outletId ?? "");
        if (outletIdsFromAssigned.length > 0 && outletIdsFromAssigned[0] !== "") {
            const unique = new Set(outletIdsFromAssigned);
            const uniqueOutletIds = Array.from(unique);
            const outlets = await this.outletRepository.findOutletByIds(uniqueOutletIds, organizationId);
            const foundOutletIds = outlets.map(outlet => outlet.outlet_id);
            if (foundOutletIds.length !== uniqueOutletIds.length) {
                const missingOutletIds = uniqueOutletIds.filter(id => !foundOutletIds.includes(id));
                throw new DataNotFound(`Outlet with id ${missingOutletIds.join(', ')} does not exist`);
            }
        }

        // remove current assigned outlet
        await this.salesTypeOutletRepository.destroySalesTypeOutlet(targetSalesType.sales_type_id, transaction);

        // remove current assigned gratuity
        await this.salesTypeGratuityRepository.destroySalesTypeGratuity(targetSalesType.sales_type_id, transaction);

        // update sales type
        targetSalesType.name = data.name;
        await targetSalesType.save({ transaction })

        // create sales type's outlet
        const salesTypeOutletList : Partial<SalesTypeOutlets>[] = [];
        outletIds.forEach(item => {
            salesTypeOutletList.push({
                sales_type_id : targetSalesType.sales_type_id,
                outlet_id : item,
            });
        });
        await this.salesTypeOutletRepository.bulkCreateSalesTypeOutlet(salesTypeOutletList, transaction);

        // create sales type's gratuity
        const salesTypeGratuityList : Partial<SalesTypeGratuity>[] = [];
        data.assignedGratuities.forEach(item => {
            salesTypeGratuityList.push({
                sales_type_id : targetSalesType.sales_type_id,
                gratuity_id : item.gratuityId,
                outlet_id : item.outletId ? item.outletId : undefined,
            });
        });
        await this.salesTypeGratuityRepository.bulkCreateSalesTypeGratuity(salesTypeGratuityList, transaction);

        return {
            salesTypeId : targetSalesType.sales_type_id,
            name : targetSalesType.name,
            outletIds : outletIds,
            assignedGratuities : data.assignedGratuities,
        }
    }
}