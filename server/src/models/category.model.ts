import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Organization from "./organization.model";


class Category extends Model {
    public category_id! : number;
    public name! : string;
    public organization_id! : string;
    public archived! : boolean;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;

    public organization? : Organization;
}

Category.init({
    category_id: {
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
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    underscored: true,
});

export default Category;