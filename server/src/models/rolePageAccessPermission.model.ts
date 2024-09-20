import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Role from "./role.model";
import PageAccessPermission from "./PageAccessPermission.models";

class RolePageAccessPermission extends Model {
    public id! : number;
    public role_id!: number;
    public permission_id!: number;
}

RolePageAccessPermission.init({
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
            model: PageAccessPermission,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
}, {
    sequelize,
    modelName: 'RolePageAccessPermission',
    tableName: 'role_page_access_permission',
    timestamps: false,
});

export default RolePageAccessPermission;