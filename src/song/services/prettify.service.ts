import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import * as striptags from 'striptags';
import { setMetadata } from '../../utils/mp3.file';
import { downloadFileFromUrl } from '../../utils/axios.uploader';
import { Song } from '../entities/song.entity';
import { Attachment } from '../entities/attachment.entity';
import * as mp3Duration from 'mp3-duration';
import { FileAwsUploaderService } from '../../file-aws-uploader/file.aws.uploader';

// tslint:disable-next-line:max-line-length
const chordRegexp = /^[A-H][b\#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4|m7add11|add11|b5|-5|4)*(\/[A-H][b\#]*)*$/;

@Injectable()
export class PrettifyService {

    private readonly songRepo: Repository<Song>;
    private readonly attachmentRepo: Repository<Attachment>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
        private readonly fileAwsUploader: FileAwsUploaderService,
    ) {
        this.songRepo = this.conection.getRepository(Song);
        this.attachmentRepo = this.conection.getRepository(Attachment);
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
                                song.text = this.normalizeText(song.text);
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

    async normalizeSongsMp3Metadata() {
        const limit = 2;
        let result = [];
        let page = 0;

        do {
            result = await this.songRepo
                .createQueryBuilder('song')
                .leftJoinAndSelect('song.audioMp3', 'audioMp3')
                .leftJoinAndSelect('song.author', 'author')
                .leftJoinAndSelect('song.album', 'album')
                .where('song.audioMp3 IS NOT NULL')
                .andWhere('audioMp3.duration IS NULL')
                .take(limit)
                .skip(page * limit)
                .getMany();

            await Promise.all(
                result.map(
                    async (song, index) => {
                        const { audioMp3 } = song;
                        if (audioMp3.path) {
                            try {
                                const buffer = await downloadFileFromUrl(encodeURI(audioMp3.path));

                                audioMp3.duration = await mp3Duration(buffer);
                                await this.attachmentRepo.save(audioMp3);

                                const newBuffer = setMetadata(buffer, {
                                    title: song.title + ' | sheep-music.com',
                                    artist: song.author && song.author.title || undefined,
                                    album: song.album && song.album.title || undefined,
                                    commentText: 'Христианские песни | sheep-music.com',
                                });
                                await this.fileAwsUploader.uploadToS3(newBuffer, audioMp3.awsKey);
                            } catch (error) {
                                Logger.error(error.message);
                            }
                        }
                    },
                ),
            );
            page++;
            Logger.log(limit * page + ' already uploaded mp3 with new metadata!');

        } while (result && result.length);
    }

    normalizeText(text) {
        if (!text) { return null; }
        const clearedFromTagsText = striptags(text);
        const result = [];
        clearedFromTagsText.split(/\r\n|\n/g).forEach((line, index) => {
            if (/Припев:|ПРИПЕВ|Пр:|Пр:в|ПР-в:|Пр-в:|Пр-в:|Припев/g.test(line)) {
                return result.push(`<span class="chorus">Припев:</span>`);
            } else if (/Приспів:/g.test(line)) {
                return result.push(`<span class="chorus">Приспів:</span>`);
            } else if (/Запев:/g.test(line)) {
                return result.push(`<span class="chorus">Запев:</span>`);
            } else if (/Проигрыш:/g.test(line)) {
                return result.push(`<span class="chorus">Проигрыш:</span>`);
            } else if (/ВСТАВКА:|Вставка:/g.test(line)) {
                return result.push(`<span class="chorus">Вставка:</span>`);
            } else if (/Intro:|INTRO:/g.test(line)) {
                return result.push(`<span class="chorus">Intro:</span>`);
            } else if (/Пред припев:|Пред-припев:/g.test(line)) {
                return result.push(`<span class="chorus">Пред припев:</span>`);
            } else if (/Pre chorus:|PRE CHORUS:/g.test(line)) {
                return result.push(`<span class="chorus">Pre chorus:</span>`);
            } else if (/Post chorus:/g.test(line)) {
                return result.push(`<span class="chorus">Post chorus:</span>`);
            } else if (/Outro:/g.test(line)) {
                return result.push(`<span class="chorus">Outro:</span>`);
            } else if (/Chorus|CHORUS:|Chorus:/g.test(line)) {
                return result.push(`<span class="chorus">Chorus:</span>`);
            } else if (/Ending:/g.test(line)) {
                return result.push(`<span class="chorus">Ending:</span>`);
            } else if (/2 куплет:|КУПЛЕТ 2|2 КУПЛЕТ:|Куплет 2:/g.test(line)) {
                return result.push(`<span class="verse">2 куплет:</span>`);
            } else if (/1 куплет:|КУПЛЕТ 1|1 КУПЛЕТ:|Куплет 1:/g.test(line)) {
                return result.push(`<span class="verse">1 куплет:</span>`);
            } else if (/3 куплет:|3 КУПЛЕТ:|КУПЛЕТ 3:|Куплет 3:/g.test(line)) {
                return result.push(`<span class="verse">3 куплет:</span>`);
            } else if (/4 куплет:|4 КУПЛЕТ:|КУПЛЕТ 4:|Куплет 4:/g.test(line)) {
                return result.push(`<span class="verse">4 куплет:</span>`);
            } else if (/5 куплет:|5 КУПЛЕТ:|КУПЛЕТ 5:|Куплет 5:/g.test(line)) {
                return result.push(`<span class="verse">5 куплет:</span>`);
            } else if (/6 куплет:|6 КУПЛЕТ:|КУПЛЕТ 6:|Куплет 6:/g.test(line)) {
                return result.push(`<span class="verse">6 куплет:</span>`);
            } else if (/1 verse:|Verse 1|Verse: 1|VERSE: 1|1 VERSE:/g.test(line)) {
                return result.push(`<span class="verse">1 verse:</span>`);
            } else if (/2 verse:|Verse 2|Verse: 2|VERSE: 2|2 VERSE:/g.test(line)) {
                return result.push(`<span class="verse">2 verse:</span>`);
            } else if (/3 verse:|Verse 3|Verse: 3|VERSE: 3|3 VERSE:/g.test(line)) {
                return result.push(`<span class="verse">3 verse:</span>`);
            } else if (/4 verse:|Verse 4|Verse: 4|VERSE: 4|4 VERSE:/g.test(line)) {
                return result.push(`<span class="verse">4 verse:</span>`);
            } else if (/5 verse:|Verse 5|Verse: 5|VERSE: 5|5 VERSE:/g.test(line)) {
                return result.push(`<span class="verse">5 verse:</span>`);
            } else if (/6 verse:|Verse 6|Verse: 6|VERSE: 6|6 VERSE:/g.test(line)) {
                return result.push(`<span class="verse">6 verse:</span>`);
            } else if (/7 verse:|Verse 7|Verse: 7|VERSE: 7|7 VERSE:/g.test(line)) {
                return result.push(`<span class="verse">7 verse:</span>`);
            } else if (/Verse:|VERSE:|Verse/g.test(line)) {
                return result.push(`<span class="verse">Verse:</span>`);
            } else if (/Концовка:|концовка:/g.test(line)) {
                return result.push(`<span class="verse">Концовка:</span>`);
            } else if (/INSTRUMENTAL:|Instrumental:/g.test(line)) {
                return result.push(`<span class="bridge">Instrumental:</span>`);
            } else if (/INTERLUDE:|Interlude:/g.test(line)) {
                return result.push(`<span class="bridge">Interlude:</span>`);
            } else if (/Куплет:|куплет:/g.test(line)) {
                return result.push(`<span class="verse">Куплет:</span>`);
            } else if (/Бридж:|Мост:|БРИДЖ:|Бридж|Мостик:|МОСТИК:/g.test(line)) {
                return result.push(`<span class="bridge">Мост:</span>`);
            } else if (/Міст:|Брідж:/g.test(line)) {
                return result.push(`<span class="bridge">Міст:</span>`);
            } else if (/Bridge:|BRIDGE:|Bridge/g.test(line)) {
                return result.push(`<span class="bridge">Bridge:</span>`);
            } else if (/TAG:|Tag:/g.test(line)) {
                return result.push(`<span class="bridge">Tag:</span>`);
            } else {
                return result.push(line);
            }
        });

        return result.join('\n');
    }

}
