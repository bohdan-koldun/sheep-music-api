import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { Connection, Repository } from 'typeorm';
import { User, Confirmation } from '../entities';
import { ConfirmDTO, EmailDTO } from '../dto';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class ForgotPasswordService {
    private readonly userRepo: Repository<User>;
    private readonly confirmRepo: Repository<Confirmation>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,

    ) {
        this.userRepo = this.conection.getRepository(User);
        this.confirmRepo = this.conection.getRepository(Confirmation);
    }

    async restorePassword(data: EmailDTO): Promise<string> {
        const user = await this.userRepo.findOne({ email: data.email });
        if (!user) {
            throw new HttpException('A user with such a email no exists', HttpStatus.BAD_REQUEST);
        }

        const confirm = await this.confirmRepo.findOne({ user });
        confirm.passwordCode = Confirmation.genarateTokenCode();
        await this.confirmRepo.save(confirm);

        this.sendPasswordRestoreEmail(user, confirm.passwordCode);

        return 'Password restore instructions sent';
    }

    async resetPassword(data: ConfirmDTO): Promise<User> {
        const { email, password, passwordConfirmation } = data;
        if (password !== passwordConfirmation) {
            throw new HttpException('The password confirmation doesn`t match', HttpStatus.BAD_REQUEST);
        }

        let user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new HttpException(`User with this email don't exist`, HttpStatus.BAD_REQUEST);
        }

        const confirm = await this.confirmRepo.findOne({ user });
        if (!confirm || confirm.passwordCode !== data.code) {
            throw new HttpException('Verification code is not valid', HttpStatus.BAD_REQUEST);
        }
        confirm.passwordCode = null;
        user.password = password;
        await user.hashPassword();
        user = await this.userRepo.save(user);
        await this.confirmRepo.save(confirm);

        return user;
    }

    private async  sendPasswordRestoreEmail(user: User, code): Promise<void> {
        const confirmationLink =
            `${this.configService.get('app.url')}` +
            `/password/reset?email=` +
            `${user.email}&code=${code}`;

        try {
            await this
                .mailerService
                .sendMail({
                    to: user.email,
                    subject: 'Restore Password',
                    html: `
                    <p>Hello, <b>${user.name}</b>!</p>
                    <p>Reset your password by visiting the link below:</p>
                    <a href='${confirmationLink}'>${confirmationLink}</a>
                    `,
                });
        } catch (error) {
            Logger.error(error.message, error);
        }

    }
}
