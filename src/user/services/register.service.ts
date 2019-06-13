import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { Connection, Repository } from 'typeorm';
import { User, Confirmation, Role, RoleUser } from '../entities';
import { UserDTO, ConfirmDTO } from '../dto';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class RegisterService {
    private readonly userRepo: Repository<User>;
    private readonly confirmRepo: Repository<Confirmation>;
    private readonly roleRepo: Repository<Role>;
    private readonly roleuserRepo: Repository<RoleUser>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,

    ) {
        this.userRepo = this.conection.getRepository(User);
        this.confirmRepo = this.conection.getRepository(Confirmation);
        this.roleRepo = this.conection.getRepository(Role);
        this.roleuserRepo = this.conection.getRepository(RoleUser);
    }

    async createUser(data: UserDTO): Promise<UserDTO> {
        const { email, password, passwordConfirmation } = data;
        let user = await this.userRepo.findOne({ where: { email } });
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        if (password !== passwordConfirmation) {
            throw new HttpException('The password confirmation doesn`t match', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepo.create({ ...data, isEmailConfirmed: false });
        user = await this.userRepo.save(user);

        const confirmation = this.confirmRepo.create({
            emailCode: Confirmation.genarateTokenCode(),
            user,
        });
        await this.confirmRepo.save(confirmation);
        this.sendConfirmEmail(user, confirmation.emailCode);

        const role = await this.roleRepo.findOne({ slug: 'actor' });
        await this.roleuserRepo.save({ user, role });

        return user.toResponseObject();
    }

    async registerConfirm(data: ConfirmDTO): Promise<UserDTO> {
        const { email, code } = data;
        const confirm: Confirmation = await this.confirmRepo.findOne({
            where: { emailCode: code },
            relations: ['user'],
        });

        if (!confirm) {
            throw new HttpException('Verification code is not valid', HttpStatus.BAD_REQUEST);
        }

        let { user } = confirm;
        if (user.email === email) {
            user.isEmailConfirmed = true;
        } else if (user.isEmailConfirmed && confirm.newEmail === email) {
            user.email = email;
            confirm.newEmail = null;
        } else {
            throw new HttpException('Verification email failed', HttpStatus.BAD_REQUEST);
        }

        confirm.emailCode = null;
        await this.confirmRepo.save(confirm);
        user = await this.userRepo.save(user);
        return user.toResponseObject();
    }

    async resendConfirmMessage(email: string): Promise<string> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (user) {
            let confirm = await this.confirmRepo.findOne({ user });
            confirm.emailCode = Confirmation.genarateTokenCode();
            confirm = await this.confirmRepo.save(confirm);
            this.sendConfirmEmail(user, confirm.emailCode);
        }

        return 'New confirmation email send';
    }

    private async  sendConfirmEmail(user: User, code): Promise<void> {
        const confirmationLink =
            `${this.configService.get('APP_URL')}` +
            `/registration/confirm?email=` +
            `${user.email}&code=${code}`;

        try {
            await this
                .mailerService
                .sendMail({
                    to: user.email,
                    subject: 'Registration Confirmation',
                    html: `
                    <p>Hello, <b>${user.name} ${user.name}</b>!</p>
                    <p>Thanks for signing up!</p>
                    <p>Confirm by visiting the link below:</p>
                    <a href='${confirmationLink}'>${confirmationLink}</a>
                    `,
                });
        } catch (error) {
            Logger.error(error.message, error);
        }

    }
}
