import { Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MALService } from 'src/routes/mal/mal.service';

@ApiTags('myanimelist')
@Controller('myanimelist')
export class MALController {
    constructor(private readonly malService: MALService) { }

    @Put('sync')
    async syncAnime() {
        await this.malService.sync();
        //
    }
}
