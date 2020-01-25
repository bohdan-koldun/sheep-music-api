import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new HttpException(`Ошибка валидации: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private formatErrors(errors: ValidationError[]) {
        return errors
            .map(err => {
                let ownErrors: string = '';
                let childErrors: string = '';

                if (err.children.length > 0) {
                    childErrors = err.children.map(
                        childErr => {
                            for (const property in childErr.constraints) {
                                return childErr.constraints[property];
                            }
                        },
                    )
                        .join(', ');
                }
                for (const property in err.constraints) {
                    ownErrors += err.constraints[property];
                }

                return ownErrors + childErrors;
            })
            .join(', ');
    }
}
