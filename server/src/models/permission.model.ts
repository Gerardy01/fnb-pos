import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Permission extends Model {
    public permission_id! : number;
    public permission_name! : string;
    public description! : string;
}

Permission.init({
    permission_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    permission_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
    }
}, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permission',
    timestamps: false,
});

export default Permission;