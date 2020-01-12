
import { IsUrl, IsOptional } from 'class-validator';
import {User} from '../../../dist/user/entities';

export class AttachmentDTO {
    @IsOptional()
    id: number;

    @IsUrl()
    path: string;

    @IsOptional()
    awsKey: string;

    @IsOptional()
    owner?: User;
}
