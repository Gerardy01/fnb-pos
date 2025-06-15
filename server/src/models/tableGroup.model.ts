import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Outlet from "./outlet.model";



class TableGroup extends Model {
    public id! : number;
    public group_name! : string;
    public outlet_id! : string;
    public status! : boolean;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public outlet? : Outlet
}

TableGroup.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    group_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    outlet_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Outlet,
            key: 'outlet_id',
        },
        onDelete: 'CASCADE'
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'TableGroup',
    tableName: 'table_groups',
    timestamps: true,
    underscored: true,
});

export default TableGroup;