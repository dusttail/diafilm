import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    timestamps: false,
    createdAt: false,
    updatedAt: false
})
export class Genre extends Model {
    @Column({
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataType.INTEGER.UNSIGNED,
    })
    id: ID;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
}
