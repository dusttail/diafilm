import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Anime } from './anime.model';
import { Synonym } from './synonym.model';

@Table({
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false
})
export class AnimesToSynonym extends Model {
    @PrimaryKey
    @ForeignKey(() => Anime)
    @Column({
        allowNull: false,
        type: DataType.INTEGER.UNSIGNED,
    })
    anime_id: ID;

    @PrimaryKey
    @ForeignKey(() => Synonym)
    @Column({
        allowNull: false,
        type: DataType.INTEGER.UNSIGNED,
    })
    synonym_id: ID;
}
