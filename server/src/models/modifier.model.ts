import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";
import ModifierOption from "./modifierOption.model";


class Modifier extends Model {
    public modifier_id! : number;
    public name! : string;
    public required! : boolean;
    public min! : number;
    public max! : number;
    public organization_id! : string;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public organization? : Organization;
    public modifier_options? : ModifierOption[];
}

Modifier.init({
    modifier_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    min: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Organization,
            key: 'organization_id',
        },
        onDelete: 'CASCADE'
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Modifier',
    tableName: 'modifiers',
    timestamps: true,
    underscored: true,
});

export default Modifier;