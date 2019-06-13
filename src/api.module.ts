import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';

@Module({
    imports: [UserModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
    ],
})
export class ApiModule { }
