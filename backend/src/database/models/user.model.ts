import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../common/base.model';

@Table
export class User extends BaseModel {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
}
