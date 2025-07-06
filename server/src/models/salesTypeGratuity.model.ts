import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import SalesType from "./salesType.model";
import Outlet from "./outlet.model";
import Gratuity from "./gratuity.model";

class SalesTypeGratuity extends Model {
    public id! : number;
    public gratuity_id! : number;
    public sales_type_id! : number;
    public outlet_id! : string;

    public gratuity? : Gratuity;
    public sales_type? : SalesType;
    public outlet? : Outlet;
}

SalesTypeGratuity.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    gratuity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gratuity,
            key: 'gratuity_id',
        },
        onDelete: 'CASCADE'
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
        allowNull: true,
        references: {
            model: Outlet,
            key: 'outlet_id',
        },
        onDelete: 'CASCADE'
    },
}, {
    sequelize,
    modelName: 'SalesTypeGratuity',
    tableName: 'sales_type_gratuity',
    timestamps: false,
});

export default SalesTypeGratuity;

