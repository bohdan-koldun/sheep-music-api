import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nest-modules/mailer';
import { Connection } from 'typeorm';
import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../../database/database.module';
import { MailModule } from '../../mail/mail.module';
import { AuthModule } from '../../auth/auth.module';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '../../config/config.service';
import { userProviders } from '../user.providers';
import {
  RegisterController,
  ForgotPasswordController,
  ProfileController,
  UserController,
} from '../controllers';
import {
  RegisterService,
  ForgotPasswordService,
  ProfileService,
  UserService,
} from '../services';

describe('User Module', () => {
  let registerController: RegisterController;
  let registerService: RegisterService;

  let forgotPasswordController: ForgotPasswordController;
  let forgotPasswordService: ForgotPasswordService;

  let profileController: ProfileController;
  let profileService: ProfileService;

  let userController: UserController;
  let userService: UserService;

  let authController: AuthController;
  let authService: AuthService;

  let mailService: MailerService;

  let configService: ConfigService;

  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DatabaseModule,
        MailModule,
        AuthModule,
      ],
      controllers: [
        RegisterController,
        ForgotPasswordController,
        ProfileController,
        UserController,
      ],
      providers: [...userProviders],
    })
      .overrideProvider(ConfigService).useValue({
        get: () => 'test',
      })
      .overrideProvider(MailerService).useValue({
        sendMail: () => null,
      })
      .overrideProvider('DATABASE_CONNECTION').useValue({
        getRepository: () => null,
      })
      .compile();

    registerController = module.get<RegisterController>(RegisterController);
    registerService = module.get<RegisterService>(RegisterService);

    forgotPasswordController = module.get<ForgotPasswordController>(ForgotPasswordController);
    forgotPasswordService = module.get<ForgotPasswordService>(ForgotPasswordService);

    profileController = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    mailService = module.get<MailerService>(MailerService);

    configService = module.get<ConfigService>(ConfigService);

    connection = module.get<Connection>('DATABASE_CONNECTION');

  });

  describe('register', () => {
    it('controller should be defined', () => {
      expect(registerController).toBeDefined();
    });

    it('service should be defined', () => {
      expect(registerService).toBeDefined();
    });
  });

  describe('forgot password', () => {
    it('controller should be defined', () => {
      expect(forgotPasswordController).toBeDefined();
    });
    it('service should be defined', () => {
      expect(forgotPasswordService).toBeDefined();
    });
  });

  describe('profile', () => {
    it('controller should be defined', () => {
      expect(profileController).toBeDefined();
    });
    it('service should be defined', () => {
      expect(profileService).toBeDefined();
    });
  });

  describe('user/admin', () => {
    it('controller should be defined', () => {
      expect(userController).toBeDefined();
    });
    it('service should be defined', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('auth', () => {
    it('controller should be defined', () => {
      expect(authController).toBeDefined();
    });
    it('service should be defined', () => {
      expect(authService).toBeDefined();
    });
  });

  describe('mailer', () => {
    it('service should be defined', () => {
      expect(mailService).toBeDefined();
    });

    it('function sendMail() should be defined', () => {
      expect(mailService.sendMail).toBeDefined();
    });
  });

  describe('config', () => {
    it('service should be defined', () => {
      expect(configService).toBeDefined();
    });

    it('function get() should be defined', () => {
      expect(configService.get).toBeDefined();
    });
  });

  describe('database', () => {
    it('connection should be defined', () => {
      expect(connection).toBeDefined();
    });

    it('function getRopository() should be defined', () => {
      expect(connection.getRepository).toBeDefined();
    });
  });
});
