import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";


// models
import TableGroup from "./tableGroup.model";



class Table extends Model {
    public table_id! : number;
    public table_name! : string;
    public pax! : number;
    public table_group_id! : number;
    public operational_status! : number;
    public status! : boolean;
    public effective_status! : boolean;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public table_roup?: TableGroup;
}

Table.init({
    table_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    table_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    pax: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    table_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TableGroup,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    operational_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default to Available
        validate: {
            isIn: [[1, 2, 3, 4]],
        },
        comment: "1 = Available, 2 = Seated, 3 = Order Placed, 4 = Reserved",
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    effective_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Derived from table_group or outlet status.",
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Table',
    tableName: 'tables',
    timestamps: true,
    underscored: true,
});

export default Table;