import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";
import Role from "./role.model";


class Account extends Model {
    public account_id! : string;
    public username! : string;
    public name! : string;
    public email! : string;
    public password! : string;
    public organization_id! : string;
    public role_id! : number;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public role? : Role;
    public organization? : Organization;
}

Account.init({
    account_id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organization_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: Organization,
            key: 'organization_id',
        },
        onDelete: 'CASCADE'
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
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: true,
    underscored: true,
});

export default Account