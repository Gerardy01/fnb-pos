import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Modifier from "./modifier.model";


class ModifierOption extends Model {
    public id! : number;
    public modifier_id! : number;
    public price! : string;

    public modifier? : Modifier;
}

ModifierOption.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    modifier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Modifier,
            key: 'modifier_id',
        },
        onDelete: 'CASCADE'
    },
    price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'ModifierOption',
    tableName: 'modifier_options',
    timestamps: false,
});

export default ModifierOption;