import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    timestamps: false,
    createdAt: false,
    updatedAt: false
})
export class Synonym extends Model {
    @Column({
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataType.INTEGER,
    })
    id: ID;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.STRING(3),
        allowNull: true,
    })
    lang: string;
}
