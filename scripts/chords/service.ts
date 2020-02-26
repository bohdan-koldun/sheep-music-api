import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../../src/api/entities/song.entity';
import { Attachment } from '../../src/api/entities/attachment.entity';

// tslint:disable-next-line:max-line-length
const chordRegexp = /^[A-H][b\#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4|m7add11|add11|b5|-5|4)*(\/[A-H][b\#]*)*$/;

@Injectable()
export class ChordsScriptsService {

    private readonly songRepo: Repository<Song>;
    private readonly attachmentRepo: Repository<Attachment>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,

    ) {
        this.songRepo = this.conection.getRepository(Song);
        this.attachmentRepo = this.conection.getRepository(Attachment);
    }

    async updateChodsKey() {
        await this.songRepo.update(
            { chordsKey: 'Hb' },
            { chordsKey: 'B' },
        );
    }

    async normalizeSongsText() {
        let result = [];
        let page = 0;

        do {
            result = await this.songRepo
                .createQueryBuilder('song')
                .take(200)
                .skip(page * 200)
                .getMany();

            await Promise.all(
                result.map(
                    async (song, index) => {
                        try {
                            if (song && song.text) {
                                await this.songRepo.save(song);
                                Logger.log(`Pretified ${index} song`);
                            }

                        } catch (error) {
                            Logger.error(error.message, error);
                        }
                    },
                ),
            );
            page++;

        } while (result && result.length);

        return 'successful normalized texts';
    }

}
