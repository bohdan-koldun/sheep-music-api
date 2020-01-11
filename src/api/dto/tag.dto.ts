import { IsOptional, IsNotEmpty } from 'class-validator';

export class TagDTO {
    @IsOptional()
    id: number;

    @IsNotEmpty()
    name: string;
}
