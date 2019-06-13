import { Module } from '@nestjs/common';
import { FileAwsUploaderService } from './file.aws.uploader';

@Module({
    providers: [FileAwsUploaderService],
    exports: [FileAwsUploaderService],
})
export class FileAwsUploaderModule { }
