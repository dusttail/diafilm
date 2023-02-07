import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Anime } from './anime.model';
import { Genre } from './genre.model';

@Table({
    timestamps: false,
    createdAt: false,
    updatedAt: false
})
export class AnimesToGenre extends Model {
    @PrimaryKey
    @ForeignKey(() => Anime)
    @Column({
        allowNull: false,
        type: DataType.INTEGER.UNSIGNED,
    })
    anime_id: ID;

    @PrimaryKey
    @ForeignKey(() => Genre)
    @Column({
        allowNull: false,
        type: DataType.INTEGER.UNSIGNED,
    })
    genre_id: ID;
}
