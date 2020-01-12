import { IsOptional, IsNotEmpty } from 'class-validator';
import {User} from '../../user/entities/user.entity';

export class TagDTO {
    @IsOptional()
    id: number;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    owner?: User;
}
