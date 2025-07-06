import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";
import Outlet from "./outlet.model";
import SalesTypeGratuity from "./salesTypeGratuity.model";


class SalesType extends Model {
    public sales_type_id! : number;
    public name! : string;
    public organization_id! : string;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public organization? : Organization;
    public outlets? : Outlet[];
    public sales_type_gratuity? : SalesTypeGratuity[];
}

SalesType.init({
    sales_type_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Organization,
            key: 'organization_id',
        },
        onDelete: 'CASCADE'
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'SalesType',
    tableName: 'sales_types',
    timestamps: true,
    underscored: true,
});

export default SalesType;