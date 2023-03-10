import { Column, CreatedAt, DataType, Model, UpdatedAt } from 'sequelize-typescript';

export class BaseModel extends Model {
    @Column({
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataType.INTEGER.UNSIGNED,
    })
    id: ID;
    @CreatedAt
    created_at: Date;
    @UpdatedAt
    updated_at: Date;
}
