import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class PageAccessPermission extends Model {
    public id! : number;
    public permission_name! : string;
    public description! : string;
}

PageAccessPermission.init({
    id: {
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
    modelName: 'PageAccessPermission',
    tableName: 'page_access_permissions',
    timestamps: false,
});

export default PageAccessPermission;

