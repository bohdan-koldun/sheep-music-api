import { Module } from '@nestjs/common';
import { songProviders } from './song.providers';
import {
    SongController,
} from './controllers';

@Module({
    controllers: [
        SongController,
    ],
    providers: [
        ...songProviders,
    ],
    exports: [
        ...songProviders,
    ],
})

export class SongModule { }
