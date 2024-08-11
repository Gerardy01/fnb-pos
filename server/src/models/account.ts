import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";


class Account extends Model {}

Account.init({
    account_id: {
        type: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    // password: {

    // },
    // organization: {

    // }
}, {
    sequelize,
    tableName: 'account',
    timestamps: true,
});

export default Account