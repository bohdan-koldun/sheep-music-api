import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../../src/api/entities/song.entity';
import { haveTextChordsLine } from '../utils/chords';

@Injectable()
export class ChordsScriptsService {

    private readonly songRepo: Repository<Song>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,

    ) {
        this.songRepo = this.conection.getRepository(Song);
    }

    async updateChodsKey() {
        await this.songRepo.update(
            { chordsKey: 'H' },
            { chordsKey: 'B' },
        );
    }

    async deleteTextWithoutChords() {
        let result = [];
        let page = 0;

        do {
            result = await this.songRepo
                .createQueryBuilder('song')
                .where('song.chords is not null')
                .take(200)
                .skip(page * 200)
                .getMany();

            await Promise.all(
                result.map(
                    async song => {
                        try {
                            if (!haveTextChordsLine(song.chords)) {
                                await this.songRepo.save({ ...song, chords: null });
                            }
                        } catch (error) {
                            Logger.error(error.message, error);
                        }
                    },
                ),
            );
            page++;

        } while (result && result.length);
    }

}
