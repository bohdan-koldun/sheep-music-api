import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../entities/song.entity';

// tslint:disable-next-line:max-line-length
const chordRegexp = /^[A-H][b\#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4|m7add11|add11|b5|-5|4)*(\/[A-H][b\#]*)*$/;

@Injectable()
export class PrettifyService {

    private readonly songRepo: Repository<Song>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
    }

    async prettifyChords() {
        const songs = await this.songRepo.find();

        for (const song of songs) {
            await this.songRepo.save({
                ...song,
                chords: song && song.chords && song.chords.replace(/<br>/g, '\n'),
                text: this.clearChords(song.chords),
            });
        }

        Logger.log('end prettify');
        return 'prettify chords done';
    }

    private clearChords(chords) {
        if (!chords) { return null; }
        const deletedBr = chords.replace(/<br>/g, '\n');
        const isChordLine = (input) => {
            const tokens = input.replace(/\s+/, ' ').split(' ');
            for (const token of tokens) {
                if (token.trim().length !== 0 && !token.match(chordRegexp)) {
                    return false;
                }
            }
            return true;
        };

        const result = [];
        deletedBr.split(/\r\n|\n/g).forEach((line, index) => {
            if (!isChordLine(line)) {
                return result.push(line);
            }

        });

        return result.join('\n');
    }

}
