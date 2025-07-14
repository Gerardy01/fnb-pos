import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Tax from "./tax.model";
import Outlet from "./outlet.model";



class TaxOutlets extends Model {
    public id! : number;
    public tax_id! : number;
    public outlet_id! : string;
}

TaxOutlets.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    tax_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tax,
            key: 'tax_id',
        },
        onDelete: 'CASCADE'
    },
    outlet_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Outlet,
            key: 'outlet_id',
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'TaxOutlet',
    tableName: 'tax_outlet',
    timestamps: false,
});

export default TaxOutlets;