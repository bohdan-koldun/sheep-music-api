import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { SongDTO } from '../dto';
import { Attachment } from './attachment.entity';
import { Album } from './album.entity';
import { Author } from './author.entity';
import { Tag } from './tag.entity';
import { Translation } from './translation.entity';

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    chords: string;

    @Column({ type: 'text', nullable: true })
    text: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    chordsKey: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    parsedSource: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    video: string;

    @ManyToOne(type => Attachment, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    audioMp3: Attachment;

    @Column({ type: 'varchar', length: 20, nullable: true })
    language: string;

    @ManyToOne(type => Album, album => album.songs, { cascade: false, eager: true })
    album: Album;

    @ManyToOne(type => Author, author => author.songs, { cascade: false, eager: true })
    author: Author;

    @ManyToMany(type => Tag, tag => tag.songs, { cascade: false })
    @JoinTable()
    tags: Tag[];

    @ManyToMany(type => Translation, translation => translation.songs, { cascade: false })
    @JoinTable()
    translations: Translation[];

    toResponseObject(): SongDTO {
        const {
            id,
            title,
            chords,
            chordsKey,
            text,
            album,
            audioMp3,
            author,
            tags,
        } = this;

        return {
            id,
            title,
            chords,
            chordsKey,
            text,
            album,
            audioMp3,
            author,
            tags,
        };
    }
}
