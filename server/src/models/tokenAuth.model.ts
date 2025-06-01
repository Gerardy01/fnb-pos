import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Account from "./account.model";

class TokenAuth extends Model {
    public id! : number;
    public token! : string;
    public account_id! : string; 
    public expires_at! : Date;
    public used! : boolean;
    public readonly created_at! : Date;

    public account? : Account
}

TokenAuth.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    account_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: Account,
            key: 'account_id'
        },
        onDelete: 'CASCADE'
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'TokenAuth',
    tableName: 'token_auth',
    timestamps: true,
    underscored: true,
    updatedAt: false,
});

export default TokenAuth;