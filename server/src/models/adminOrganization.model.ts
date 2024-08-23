import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Account from "./account.model";
import Organization from "./organization.model";

class AdminOrganization extends Model {
    public id! : number;
    public account_id! : string;
    public organization_id! : string;
}

AdminOrganization.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    account_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: Account,
            key: 'account_id',
        },
        onDelete: 'CASCADE'
    },
    organization_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: Organization,
            key: 'organization_id',
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'AdminOrganization',
    tableName: 'admin_organizations',
    timestamps: true,
    underscored: true,
    createdAt: false,
});

export default AdminOrganization;