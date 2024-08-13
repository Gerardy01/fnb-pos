import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";


class Role extends Model {
    public role_id! : number;
    public role_name! : string;
    public is_default! : boolean;
    public organization_id! : string;
}

Role.init({
    role_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    role_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    organization_id: {
        type: DataTypes.UUIDV4,
        allowNull: true,
        references: {
            model: Organization,
            key: 'organization_id',
        },
        onDelete: 'CASCADE'
    },
}, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: false,
});

export default Role;

