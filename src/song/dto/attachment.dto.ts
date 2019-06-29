
import { IsUrl, IsOptional } from 'class-validator';

export class AttachmentDTO {
    @IsOptional()
    id: number;

    @IsUrl()
    path: string;

    @IsOptional()
    awsKey: string;
}
