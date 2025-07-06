import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import SalesType from "./salesType.model";
import Outlet from "./outlet.model";


class SalesTypeOutlets extends Model {
    public id! : number;
    public sales_type_id! : number;
    public outlet_id! : string;
}

SalesTypeOutlets.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    sales_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SalesType,
            key: 'sales_type_id',
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
    modelName: 'SalesTypeOutlet',
    tableName: 'sales_type_outlet',
    timestamps: false,
});

export default SalesTypeOutlets;




