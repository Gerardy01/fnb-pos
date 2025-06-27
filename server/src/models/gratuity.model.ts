import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";


class Gratuity extends Model {
    public gratuity_id! : number;
    public name! : string;
    public written_name! : string;
    public amount! : string;
    public calculation_type! : number;
    public organization_id! : string;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public organization? : Organization;
}

Gratuity.init({
    gratuity_id: {
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
    calculation_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: [[1, 2]],
        },
        comment: "1 = Percent, 2 = Fixed",
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
    modelName: 'Gratuity',
    tableName: 'gratuities',
    timestamps: true,
    underscored: true,
});

export default Gratuity;