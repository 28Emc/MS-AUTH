import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginModes, User, UserStatus } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtResponseDto } from '../dto/jwt-response.dto';

@Injectable()
export class PassportService {
    constructor(
        @InjectRepository(User, 'security')
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async passportGoogleCallback(req: any): Promise<JwtResponseDto> {
        if (!req) {
            throw new NotFoundException("User info from Google not found");
        }
        let payload = {};
        /* const foundUser = await this.userRepository
            .createQueryBuilder('user')
            .where({ username: req.user.email })
            .getOne();
        if (foundUser) {
            payload = {
                sub: foundUser.userId,
                username: foundUser.username,
                picture: foundUser.picture,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                status: foundUser.status,
                flgLogin: foundUser.flgLogin,
                creationDate: foundUser.creationDate,
                createdBy: foundUser.createdBy,
                modifiedDate: foundUser.modifiedDate,
                modifiedBy: foundUser.modifiedBy,
            };
        } else {
            const createdUser = await this.userRepository.save({
                username: req.user.email,
                password: await bcrypt.hash(req.user.email, 10),
                picture: req.user.picture,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                status: UserStatus.ACTIVE,
                flgLogin: LoginModes.GOOGLE
            });
            payload = {
                sub: createdUser.userId,
                username: createdUser.username,
                picture: createdUser.picture,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                status: createdUser.status,
                flgLogin: createdUser.flgLogin,
                creationDate: createdUser.creationDate,
                createdBy: createdUser.createdBy,
                modifiedDate: createdUser.modifiedDate,
                modifiedBy: createdUser.modifiedBy,
            };
        } */

        payload = {
            username: req.user.email,
            password: await bcrypt.hash(req.user.email, 10),
            picture: req.user.picture,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            status: UserStatus.ACTIVE,
            flgLogin: LoginModes.GOOGLE
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async passportFacebookCallback(req: any): Promise<JwtResponseDto> {
        if (!req) {
            throw new NotFoundException("User info from Facebook not found");
        }
        let payload = {};
        /* const foundUser = await this.userRepository
            .createQueryBuilder('user')
            .where({ username: req.user.email })
            .getOne();
        if (foundUser) {
            payload = {
                sub: foundUser.userId,
                username: foundUser.username,
                picture: foundUser.picture,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                status: foundUser.status,
                flgLogin: foundUser.flgLogin,
                creationDate: foundUser.creationDate,
                createdBy: foundUser.createdBy,
                modifiedDate: foundUser.modifiedDate,
                modifiedBy: foundUser.modifiedBy,
            };
        } else {
            const createdUser = await this.userRepository.save({
                username: req.user.email,
                password: await bcrypt.hash(req.user.email, 10),
                picture: req.user.picture,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                status: UserStatus.ACTIVE,
                flgLogin: LoginModes.FACEBOOK
            });
            payload = {
                sub: createdUser.userId,
                username: createdUser.username,
                picture: createdUser.picture,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                status: createdUser.status,
                flgLogin: createdUser.flgLogin,
                creationDate: createdUser.creationDate,
                createdBy: createdUser.createdBy,
                modifiedDate: createdUser.modifiedDate,
                modifiedBy: createdUser.modifiedBy,
            };
        } */

        payload = {
            username: req.user.email,
            password: await bcrypt.hash(req.user.email, 10),
            picture: req.user.picture,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            status: UserStatus.ACTIVE,
            flgLogin: LoginModes.FACEBOOK
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async passportGithubCallback(req: any): Promise<JwtResponseDto> {
        if (!req) {
            throw new NotFoundException("User info from Github not found");
        }
        let payload = {};
        /* const foundUser = await this.userRepository
            .createQueryBuilder('user')
            .where({ username: req.user.email })
            .getOne();
        if (foundUser) {
            payload = {
                sub: foundUser.userId,
                username: foundUser.username,
                picture: foundUser.picture,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                status: foundUser.status,
                flgLogin: foundUser.flgLogin,
                creationDate: foundUser.creationDate,
                createdBy: foundUser.createdBy,
                modifiedDate: foundUser.modifiedDate,
                modifiedBy: foundUser.modifiedBy,
            };
        } else {
            const createdUser = await this.userRepository.save({
                username: req.user.email,
                password: await bcrypt.hash(req.user.email, 10),
                picture: req.user.picture,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                status: UserStatus.ACTIVE,
                flgLogin: LoginModes.GITHUB
            });
            payload = {
                sub: createdUser.userId,
                username: createdUser.username,
                picture: createdUser.picture,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                status: createdUser.status,
                flgLogin: createdUser.flgLogin,
                creationDate: createdUser.creationDate,
                createdBy: createdUser.createdBy,
                modifiedDate: createdUser.modifiedDate,
                modifiedBy: createdUser.modifiedBy,
            };
        } */

        payload = {
            username: req.user.email,
            password: await bcrypt.hash(req.user.email, 10),
            picture: req.user.picture,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            status: UserStatus.ACTIVE,
            flgLogin: LoginModes.GITHUB
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async passportCallback(req: any, provider: LoginModes): Promise<JwtResponseDto> {
        if (!req) {
            throw new NotFoundException("User info not found");
        }

        // WE'RE ASSUMING THAT req PARAM PROVIDES THE SAME DATA VALUES
        const payload = {
            username: req.user.email,
            displayName: req.user.displayName,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            picture: req.user.picture,
            status: UserStatus.ACTIVE,
            flgLogin: provider
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
