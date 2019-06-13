import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '../config/config.service';
import { User } from '../user/entities';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            secret: 'tesKey',
          }),
        }),
      ],
      providers: [AuthService, JwtStrategy],
    }).overrideProvider(ConfigService).useValue({
      get: () => 'test',
    })
      .overrideProvider('DATABASE_CONNECTION').useValue({
        getRepository: () => new Repository<User>(),
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('jwtService should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('function createToken()', () => {
    it('should be defined', () => {
      expect(service.createToken).toBeDefined();
    });

    it('should return token object', () => {
      const token = {
        expiresIn: 'no expire',
        accessToken: 'test_token',
      };

      jest.spyOn(jwtService, 'sign').mockImplementation(() => token.accessToken);
      const result = service.createToken('test@test.test');
      expect(result).toEqual(token);
    });
  });

  describe('function login()', () => {
    const user: User = {
      id: 1,
      name: 'test',
      email: 'email@test.test',
      isEmailConfirmed: true,
      password: '111111111',
      phone: '0444122211',
      facebookId: '',
      googleId: '',
      confirmation: null,
      roles: null,
      passwordConfirmation: null,
      hashPassword: () => null,
      comparePassword: () => Promise.resolve(user),
      toResponseObject: () => ({
        ...user,
      }),
    };

    const token = {
      expiresIn: 'no expire',
      accessToken: 'test_token',
    };

    beforeEach(async () => {
      jest.spyOn(jwtService, 'sign').mockImplementation(() => token.accessToken);
    });

    it('should be defined', () => {
      expect(service.login).toBeDefined();
    });

    it('should throw HttpException "Email is not confirmed"', () => {
      user.isEmailConfirmed = false;
      expect(service.login({ email: '' })).rejects.toEqual(
        new HttpException('Email is not confirmed', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw HttpException "Invalid username/password"', () => {
      user.comparePassword = () => Promise.resolve(null);
      expect(service.login({ email: '' })).rejects.toEqual(
        new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('function validateUser()', () => {
    it('should be defined', () => {
      expect(service.validateUser).toBeDefined();
    });
  });
});
