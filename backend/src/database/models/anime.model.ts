import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../common/base.model';
import { MediaType } from './media_types.model';

export const NSFW_TYPES = {
    WHITE: {
        SERVER_VALUE: 1,
        CLIENT_VALUE: 'white'
    },
    GRAY: {
        SERVER_VALUE: 2,
        CLIENT_VALUE: 'gray'
    },
    BLACK: {
        SERVER_VALUE: 4,
        CLIENT_VALUE: 'black'
    }
};

@Table
export class Anime extends BaseModel {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @ForeignKey(() => MediaType)
    @Column(DataType.INTEGER.UNSIGNED)
    media_type_id: number;

    @Column(DataType.STRING)
    picture: string;

    @Column(DataType.STRING)
    large_picture: string;

    @Column({
        type: DataType.FLOAT,
        defaultValue: 0
    })
    mal_score: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        defaultValue: 0
    })
    mal_scoring_users: number;

    @Column({
        type: DataType.TINYINT,
        defaultValue: NSFW_TYPES.GRAY.CLIENT_VALUE,
    })
    nsfw: number;
}
