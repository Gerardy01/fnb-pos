import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";


class Outlet extends Model {
    public outlet_id! : string;
    public outlet_name! : string;
    public organization_id! : string;
    public address! : string;
    public city! : string;
    public province! : string;
    public postal_code! : string;
    public status! : boolean;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public organization? : Organization;
}

Outlet.init({
    outlet_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    outlet_name: {
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
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    province: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'Outlet',
    tableName: 'outlets',
    timestamps: true,
    underscored: true,
});

export default Outlet;