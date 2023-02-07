import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Anime } from 'src/database/models/anime.model';
import { AnimesToGenre } from 'src/database/models/animes_to_genge.model';
import { AnimesToSynonym } from 'src/database/models/animes_to_synonym.model';
import { Genre } from 'src/database/models/genre.model';
import { MediaType } from 'src/database/models/media_types.model';
import { Synonym } from 'src/database/models/synonym.model';
import { MALService } from 'src/routes/mal/mal.service';
import { MALController } from './mal.controller';

@Module({
    imports: [
        SequelizeModule.forFeature([
            Anime,
            Genre,
            Synonym,
            AnimesToGenre,
            AnimesToSynonym,
            MediaType
        ])
    ],
    controllers: [MALController],
    providers: [MALService]
})
export class MALModule { }
