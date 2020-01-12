import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import * as sharp from 'sharp';
import { Attachment } from '../../entities/attachment.entity';
import { FileAwsUploaderService } from '../../../file-aws-uploader/file.aws.uploader';

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

    async removeAttachment(attachment: Attachment) {
        if (attachment) {
            this.fileAwsUploader.deleteFromOceanSpaces(attachment.awsKey);

            await this.attachmentRepo.remove(attachment);
        }

    }
}
