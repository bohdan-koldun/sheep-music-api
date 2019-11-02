import { Module, Global } from '@nestjs/common';
import { FileAwsUploaderService } from './file.aws.uploader';

@Global()
@Module({
    providers: [FileAwsUploaderService],
    exports: [FileAwsUploaderService],
})
export class FileAwsUploaderModule { }
