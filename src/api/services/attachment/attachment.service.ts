import {Injectable, Inject, HttpException, HttpStatus, Logger} from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import * as sharp from 'sharp';
import { Attachment } from '../../entities/attachment.entity';
import { FileAwsUploaderService } from '../../../file-aws-uploader/file.aws.uploader';
import * as mp3Duration from 'mp3-duration';
import {setMetadata} from '../../../common/utils/mp3.file';
import {Song} from '../../entities/song.entity';

@Injectable()
export class AttachmentService {
    private readonly attachmentRepo: Repository<Attachment>;
    @Inject()
    private readonly fileAwsUploader: FileAwsUploaderService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.attachmentRepo = this.conection.getRepository(Attachment);
    }

    async saveSquareImageAttachment(file: any, dimension: number, slug: string, attachment?: Attachment): Promise<Attachment> {
        const { mimetype, buffer, originalname } = file;

        if (!/(jpeg|png)/g.test(mimetype)) {
            throw new HttpException('No available format. Allowed: jpg, png', HttpStatus.BAD_REQUEST);
        }

        const imgInfo = await sharp(buffer).metadata();
        const { width, height } = imgInfo;

        if (width !== height || height < dimension) {
            throw new HttpException(`Upload square picture. Height must be >= ${dimension}px`, HttpStatus.BAD_REQUEST);
        }
        const { Location, Key } = await this.fileAwsUploader.uploadToS3(
            await sharp(buffer).resize(dimension, dimension).toBuffer(),
            `${slug ? `${slug}-` : ''}avatar${Date.now()}${originalname ? `.${originalname.split('.').pop()}` : ''}`,
        );

        const newAtttachment = await this.attachmentRepo
            .save({
                ...(attachment || {}),
                path: Location,
                awsKey: Key,
            });
        if (newAtttachment && attachment) { this.fileAwsUploader.deleteFromOceanSpaces(attachment.awsKey); }
        return newAtttachment;
    }

    async saveMp3(file: any, song: Song, slug = 'song'): Promise<Attachment> {
            try {
                const { buffer, originalname } = file;

                const fileType = originalname?.split('.').pop();
                const duration = await mp3Duration(buffer);
                const awsKey = `${slug}_${song.slug}_SM${Date.now()}.${fileType || ''}`;

                const newBuffer = setMetadata(buffer, {
                    title: song.title + ' | sheep-music.com',
                    artist: song.author && song.author.title || undefined,
                    album: song.album && song.album.title || undefined,
                    commentText: 'Христианские песни | sheep-music.com',
                });

                const { Location } =  await this.fileAwsUploader.uploadToS3(newBuffer, awsKey);

                return this.attachmentRepo.save({
                    duration,
                    path: /https/.test(Location) ? Location : `https://${Location}`,
                    awsKey,
                });
            } catch (error) {
                Logger.error(error.message);
            }

    }

    async removeAttachment(attachment: Attachment) {
        if (attachment) {
            this.fileAwsUploader.deleteFromOceanSpaces(attachment.awsKey);

            await this.attachmentRepo.remove(attachment);
        }
    }
}
