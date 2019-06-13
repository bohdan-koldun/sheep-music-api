import {  Injectable, Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { ConfigService } from '../config/config.service';

@Injectable()
export class FileAwsUploaderService {
    private readonly s3: aws.S3;
    private readonly config = {
        SPACES_KEY: null,
        SPACES_SECRET: null,
        SPACES_ENDPOINT: null,
        SPACES_REGION: null,
        SPACES_BUCKET: null,
    };

    constructor(private readonly configService: ConfigService) {
        Object.keys(this.config).forEach(key => {
            this.config[key] = configService.get(key);
        });
        const { protocol, host, port } = new aws.Endpoint(
            this.config.SPACES_ENDPOINT,
        );

        this.s3 = new aws.S3({
            endpoint: `${protocol}//${host}:${port}`,
            accessKeyId: this.config.SPACES_KEY,
            secretAccessKey: this.config.SPACES_SECRET,
        });
    }

    async getFromOceanSpaces(key: string) {
        try {
            const getParams = {
                Bucket: this.config.SPACES_BUCKET,
                Key: key,
            };
            return await this.s3.getObject(getParams).promise();
        } catch (err) {
            if (err.code === 'NoSuchKey') {
                return;
            } else {
               Logger.error(err.message, err);
            }
        }
    }

    deleteFromOceanSpaces(key) {
        const deleteParams = {
            Bucket: this.config.SPACES_BUCKET,
            Key: key,
        };
        return this.s3.deleteObject(deleteParams).promise();
    }

    uploadToS3(file: Buffer, key: string) {
        const uploadParams = {
            Body: file,
            Bucket: this.config.SPACES_BUCKET,
            Key: key,
            ACL: 'public-read',
        };

        return this.s3.upload(uploadParams).promise();
    }
}
