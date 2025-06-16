import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Account from "./account.model";
import Outlet from "./outlet.model";


class AccountOutlets extends Model {
    public id! : number;
    public account_id! : string;
    public outlet_id! : string;
}

AccountOutlets.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    account_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Account,
            key: 'account_id',
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
    modelName: 'AccountOutlet',
    tableName: 'account_outlet',
    timestamps: false,
});

export default AccountOutlets;