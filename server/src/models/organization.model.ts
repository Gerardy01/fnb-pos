import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";


class Organization extends Model {
    public organization_id! : string;
    public organization_name! : string;
    public organization_logo! : string;
    public organization_no! : string;
    public archived! : boolean;
    public end_valid_datetime! : Date;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;
}

Organization.init({
    organization_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    organization_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organization_logo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    organization_no: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    end_valid_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Organization',
    tableName: 'organizations',
    timestamps: true,
    underscored: true,
});

export default Organization;