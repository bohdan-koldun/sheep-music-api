import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import {
  RegisterController,
  ForgotPasswordController,
  ProfileController,
  UserController,
} from './controllers';

@Module({
  controllers: [
    RegisterController,
    ForgotPasswordController,
    ProfileController,
    UserController,
  ],
  providers: [
    ...userProviders,
  ],
})

export class UserModule { }
