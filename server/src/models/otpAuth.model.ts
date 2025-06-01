import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class OtpAuth extends Model {
    public id! : number;
    public code! : number;
    public send_to! : string;
    public expires_at! : Date;
    public revoked! : boolean;
    public readonly created_at! : Date;
}

OtpAuth.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    send_to: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'OtpAuth',
    tableName: 'otp_auth',
    timestamps: true,
    underscored: true,
    updatedAt: false,
});

export default OtpAuth;