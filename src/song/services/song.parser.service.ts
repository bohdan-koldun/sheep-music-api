import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../entities/song.entity';
import { SongDTO } from '../dto';
import { Album } from '../entities/album.entity';
import { Author } from '../entities/author.entity';
import { Attachment } from '../entities/attachment.entity';
import { Tag } from '../entities/tag.entity';
import { Translation } from '../entities/translation.entity';

@Injectable()
export class SongParserService {

    private readonly songRepo: Repository<Song>;
    private translations = new Map();

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
    }

    async getSongList(): Promise<SongDTO[]> {
        const users = await this.songRepo.find();
        return users.map(user => user.toResponseObject()) as unknown as SongDTO[];
    }

    async saveParsedSong(data: any) {
        const {
            title,
            songText,
            url,
            audioMp3,
            videoAttachment,
            tags,
            translations,
            chordsKey,
            album,

        } = data;

        if (!title) { return; }
        let author = null; let savedAlbum = null;
        if (album) {
            author = album.author;
            author = await this.saveParsedAuthor(author);
            savedAlbum = await this.saveParsedAlbum(album, author);
        }

        let song = await this.conection
            .getRepository(Song)
            .findOne({ parsedSource: url });

        if (title && !song) {
            song = await this.songRepo
                .save({
                    title,
                    chords: songText,
                    chordsKey,
                    parsedSource: url,
                    video: videoAttachment,
                    album: savedAlbum,
                    audioMp3: await this.saveAttachment(audioMp3),
                    author,
                    tags: await this.saveTags(tags),
                });
        }

        if (translations && translations.length) {
            this.translations.set(url, translations);
        }
        return song;
    }

    async saveTranslations() {
        for (const [key, value] of this.translations) {
            const song = await this.songRepo
                .findOne({ parsedSource: key });
            const translations = [];
            for (const item of value) {
                const translationSong = await this.songRepo
                    .findOne({ parsedSource: item && item.href });
                if (translationSong && item.translatin) {
                    translations.push({
                        song: translationSong,
                        language: item.translatin,
                    });
                }
            }

            song.translations = await this.conection
                .getRepository(Translation)
                .save(translations);

            await this.songRepo.save(song);
        }
    }

    async saveParsedAlbum(data: any, author?: Author) {
        const {
            title,
            url,
            year,
            description,
            thumbnailImg,
            iTunes,
            googlePlay,
        } = data;

        if (title === 'Без альбома') { return null; }

        let album = await this.conection
            .getRepository(Album)
            .findOne({ parsedSource: url });

        if (title && !album) {
            album = await this.conection
                .getRepository(Album)
                .save({
                    title,
                    description,
                    year,
                    iTunes,
                    googlePlay,
                    parsedSource: url,
                    author,
                    thumbnail: await this.saveAttachment(thumbnailImg),
                });
        }

        return album;
    }

    async saveParsedAuthor(data: any) {
        const {
            name,
            url,
            description,
            thumbnailImg,
        } = data;
        let author = await this.conection
            .getRepository(Author)
            .findOne({ parsedSource: url });
        if (name && !author) {
            author = await this.conection
                .getRepository(Author)
                .save({
                    title: name,
                    description,
                    parsedSource: url,
                    thumbnail: await this.saveAttachment(thumbnailImg),
                });
        }
        return author;
    }

    async saveAttachment(url: string) {
        if (!url) { return null; }
        const awsKey = url.split('/').pop();

        return await this.conection
            .getRepository(Attachment)
            .save({
                path: url,
                awsKey,
            });
    }

    async saveTags(tags: string[]): Promise<Tag[]> {
        if (!tags || !tags.length) { return null; }

        return await await Promise.all(
            tags.map(async (item) => {
                const tag = await this.conection
                    .getRepository(Tag)
                    .findOne({
                        name: item,
                    });
                if (tag) { return tag; }

                return await this.conection
                    .getRepository(Tag)
                    .save({
                        name: item,
                    });
            }));
    }
}
