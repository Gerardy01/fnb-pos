import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Counter extends Model {
    public counter_id! : number;
    public context! : string;
    public count! : number;
    public readonly created_at! : Date;
    public readonly updated_at! : Date;
}

Counter.init({
    counter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    context: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'Counter',
    tableName: 'counter',
    timestamps: true,
    underscored: true,
});

export default Counter;