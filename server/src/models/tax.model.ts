import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";


class Tax extends Model {
    public tax_id! : number;
    public name! : string;
    public written_name! : string;
    public amount! : string;
    public organization_id! : string;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public organization? : Organization;
}

Tax.init({
    tax_id: {
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
    written_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
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
    modelName: 'Tax',
    tableName: 'taxes',
    timestamps: true,
    underscored: true,
});

export default Tax;