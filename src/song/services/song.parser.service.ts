import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Song } from '../entities/song.entity';
import { SongDTO } from '../dto';
import { Album } from '../entities/album.entity';
import { Author } from '../entities/author.entity';
import { Attachment } from '../entities/attachment.entity';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class SongParserService {
    @Inject('DATABASE_CONNECTION')
    private readonly conection: Connection;

    async getSongList(): Promise<SongDTO[]> {
        const users = await this.conection
            .getRepository(Song)
            .find();

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

        let { author } = album;
        author = await this.saveParsedAuthor(author);
        const savedAlbum = await this.saveParsedAlbum(album, author);

        let song = await this.conection
            .getRepository(Song)
            .findOne({ parsedSource: url });

        if (title && !song) {
            song = await this.conection
                .getRepository(Song)
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

        return song;
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
