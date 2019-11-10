import {
    Column, Entity, PrimaryGeneratedColumn, JoinColumn,
    ManyToOne, JoinTable, ManyToMany,
    CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';
import { SongDTO } from '../dto';
import { Attachment } from './attachment.entity';
import { Album } from './album.entity';
import { Author } from './author.entity';
import { Tag } from './tag.entity';
import { Translation } from './translation.entity';

@Entity('songs')
export class Song {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 100, unique: true })
    slug: string;

    @Index()
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

    @Index()
    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date;

    @Index()
    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    @ManyToOne(type => Attachment, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    audioMp3: Attachment;

    @Column({ type: 'varchar', length: 20, nullable: true })
    language: string;

    @Column({ type: 'int',  default: 0 })
    viewCount: number;

    @Column({ type: 'int',  default: 0 })
    likeCount: number;

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
            slug,
            title,
            chords,
            chordsKey,
            text,
            album,
            audioMp3,
            author,
            tags,
            video,
            parsedSource,
            viewCount,
            likeCount,
        } = this;

        return {
            id,
            slug,
            title,
            chords,
            chordsKey,
            text,
            album,
            audioMp3,
            author,
            tags,
            video,
            parsedSource,
            viewCount,
            likeCount,
        };
    }
}
