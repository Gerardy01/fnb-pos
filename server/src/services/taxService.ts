
// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize"
import { ICreateTaxData, IEditTaxData, TaxCompleteReturnData, TaxReturnData } from "../interfaces/ITax"
import { ITaxRepository } from "../repositories/taxRepository"
import { ITaxOutletRepository } from "../repositories/taxOutletRepository"
import { IOutletRepository } from "../repositories/outletRepository";
import { TaxOutlets } from "../models";
export interface ITaxService {
    getAllTax(organizationId : string) : Promise<TaxReturnData[]>
    getAllTaxComplete(organizationId : string) : Promise<TaxCompleteReturnData[]>
    getOneTax(taxId : number, organizationId : string) : Promise<TaxCompleteReturnData>
    createTax(data : ICreateTaxData, organizationId : string, transaction? : Transaction) : Promise<TaxCompleteReturnData>
    editTax(data : IEditTaxData, organizationId : string, transaction? : Transaction) : Promise<TaxCompleteReturnData>
    deleteTax(taxId : number, organizationId : string) : Promise<boolean>
}


export class TaxService implements ITaxService {
    constructor(
        private taxRepository : ITaxRepository,
        private taxOutletRepository : ITaxOutletRepository,
        private outletRepository : IOutletRepository,
    ) {}

    async getAllTax(organizationId: string): Promise<TaxReturnData[]> {
        
        const taxes = await this.taxRepository.findTaxByOrganization(organizationId);

        const taxList : TaxReturnData[] = [];
        taxes.forEach(item => {
            taxList.push({
                taxId : item.tax_id,
                name : item.name,
                writtenName : item.written_name,
                amount : item.amount,
            });
        });

        return taxList;
    }

    async getAllTaxComplete(organizationId: string): Promise<TaxCompleteReturnData[]> {
        
        const taxes = await this.taxRepository.findTaxByOrganization(organizationId, true);

        const taxList : TaxCompleteReturnData[] = [];
        taxes.forEach(item => {
            taxList.push({
                taxId : item.tax_id,
                name : item.name,
                writtenName : item.written_name,
                amount : item.amount,
                outletIds : item.outlets ? item.outlets.map(e => e.outlet_id) : [],
            });
        });

        return taxList;
    }

    async getOneTax(taxId: number, organizationId: string): Promise<TaxCompleteReturnData> {
        
        const tax = await this.taxRepository.findTaxById(taxId);
        if (!tax || tax.organization_id !== organizationId) throw new DataNotFound("Data not found");

        const outlets = await this.outletRepository.findOutletByTax(taxId, organizationId);
        const outletIds = outlets.map(item => item.outlet_id);

        return {
            taxId : tax.tax_id,
            name : tax.name,
            writtenName : tax.written_name,
            amount : tax.amount,
            outletIds : outletIds,
        }
    }

    async createTax(data: ICreateTaxData, organizationId: string, transaction?: Transaction): Promise<TaxCompleteReturnData> {
        
        // check name exist
        const nameExist = await this.taxRepository.findTaxByOrganizationAndName(organizationId, data.name);
        if (nameExist) throw new ExistData("TAX409-1");

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

        // create tax
        const createdTax = await this.taxRepository.createTax({
            name : data.name,
            written_name : data.writtenName,
            amount : data.amount,
            organization_id : organizationId,
        }, transaction);

        const taxOutletList : Partial<TaxOutlets>[] = [];
        data.outletIds.forEach(item => {
            taxOutletList.push({
                tax_id : createdTax.tax_id,
                outlet_id : item,
            });
        });
        await this.taxOutletRepository.bulkCreateTaxOutlet(taxOutletList, transaction);

        return {
            taxId : createdTax.tax_id,
            name : createdTax.name,
            writtenName : createdTax.written_name,
            amount : createdTax.amount,
            outletIds : outletIds,
        }
    }

    async editTax(data: IEditTaxData, organizationId: string, transaction?: Transaction): Promise<TaxCompleteReturnData> {
        
        // check tax exist
        const targetTax = await this.taxRepository.findTaxById(data.taxId);
        if (!targetTax || targetTax.organization_id !== organizationId) throw new DataNotFound("Data not found");

        // check name exist
        const nameExist = await this.taxRepository.findTaxByOrganizationAndName(organizationId, data.name);
        if (nameExist && nameExist.tax_id !== targetTax.tax_id) throw new ExistData("TAX409-1");

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

        // remove current assigned outlet
        await this.taxOutletRepository.destroyTaxOutlet(targetTax.tax_id, transaction);

        // update tax
        targetTax.name = data.name;
        targetTax.written_name = data.writtenName;
        targetTax.amount = data.amount;
        await targetTax.save({ transaction });

        // create new tax outlet
        const taxOutletList : Partial<TaxOutlets>[] = [];
        data.outletIds.forEach(item => {
            taxOutletList.push({
                tax_id : targetTax.tax_id,
                outlet_id : item,
            });
        });
        await this.taxOutletRepository.bulkCreateTaxOutlet(taxOutletList, transaction);

        return {
            taxId : targetTax.tax_id,
            name : targetTax.name,
            writtenName : targetTax.written_name,
            amount : targetTax.amount,
            outletIds : outletIds,
        }
    }

    async deleteTax(taxId: number, organizationId: string): Promise<boolean> {

        const targetTax = await this.taxRepository.findTaxById(taxId);
        if (!targetTax || targetTax.organization_id !== organizationId) throw new DataNotFound("Data not found");

        targetTax.archived = true;
        targetTax.save();

        return true;
    }
}