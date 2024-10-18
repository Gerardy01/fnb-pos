import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Role from "./role.model";
import Permission from "./permission.model";

class RolePermissions extends Model {
    public id! : number;
    public role_id!: number;
    public permission_id!: number;
    public read!: boolean;
    public write!: boolean;

    public permission? : Permission;
}

RolePermissions.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'role_id',
        },
        onDelete: 'CASCADE'
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permission,
            key: 'permission_id',
        },
        onDelete: 'CASCADE'
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    write: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permission',
    timestamps: false,
});

export default RolePermissions;