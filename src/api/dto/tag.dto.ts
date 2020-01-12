import { IsOptional, IsNotEmpty } from 'class-validator';
import {User} from '../../../dist/user/entities';

export class TagDTO {
    @IsOptional()
    id: number;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    owner?: User;
}
