import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/models/user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RefreshJwtResponseDto } from './dto/refresh-jwt-response.dto';
import { ConfigService } from '@nestjs/config';
import { LoginProviders, UserStatus, getEnumValueByKey } from 'src/common/enums/enums';
import { REFRESH_TOKEN_EXPIRES_IN } from 'src/common/constants/constants';
import { User } from 'src/models/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async signInJWT(user: LoginDto): Promise<JwtResponseDto> {
        const foundUser: User = await this.userService.findOne(user.username);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        const isMatch: boolean = await bcrypt.compare(user.password, foundUser.password);
        if (!isMatch) {
            throw new BadRequestException('Incorrect user or password');
        }
        if (foundUser.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User account was suspended');
        }
        const payload = {
            sub: foundUser.userId,
            username: foundUser.username,
            picture: foundUser.picture,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            status: foundUser.status,
            statusDsc: getEnumValueByKey(UserStatus, foundUser.status),
            flgLogin: foundUser.flgLogin,
            flgLoginDsc: getEnumValueByKey(LoginProviders, foundUser.flgLogin),
            creationDate: foundUser.creationDate,
            createdBy: foundUser.createdBy,
            modifiedDate: foundUser.modifiedDate,
            modifiedBy: foundUser.modifiedBy,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUpJWT(user: SignUpDto): Promise<JwtResponseDto> {
        const createdUser: User = await this.userService.create(user);
        const payload = {
            sub: createdUser.userId,
            username: createdUser.username,
            picture: createdUser.picture,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            status: createdUser.status,
            statusDsc: getEnumValueByKey(UserStatus, createdUser.status),
            flgLogin: createdUser.flgLogin,
            flgLoginDsc: getEnumValueByKey(LoginProviders, createdUser.flgLogin),
            creationDate: createdUser.creationDate,
            createdBy: createdUser.createdBy,
            modifiedDate: createdUser.modifiedDate,
            modifiedBy: createdUser.modifiedBy,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async loginRedirect(req: any, provider: LoginProviders): Promise<JwtResponseDto> {
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
            statusDsc: getEnumValueByKey(UserStatus, UserStatus.ACTIVE),
            flgLogin: provider,
            flgLoginDsc: getEnumValueByKey(LoginProviders, provider),
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getProfile(req: any): Promise<AuthResponseDto> {
        const foundUser: User = await this.userService.findById(req.user.sub);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        if (foundUser.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User account was suspended');
        }
        const { password, ...restOfData } = foundUser;
        return restOfData;
    }

    async updateProfile(req: any, user: UpdateProfileDto): Promise<AuthResponseDto> {
        if (req.user.flgLogin !== LoginProviders.DEFAULT) {
            throw new BadRequestException(`Your profile information cannot be edited from here. To update your profile, please sign in to your ${LoginProviders[req.user.flgLogin]} Account and go to your ${LoginProviders[req.user.flgLogin]} Account settings.`);
        }
        const updatedUser: User = await this.userService.update(req.user.sub, user);
        const { password, ...restOfData } = updatedUser;
        return restOfData;
    }

    async updatePassword(req: any, user: UpdatePasswordDto): Promise<AuthResponseDto> {
        if (req.user.flgLogin !== LoginProviders.DEFAULT) {
            throw new BadRequestException(`Your password cannot be edited from here. To update your password, please sign in to your ${LoginProviders[req.user.flgLogin]} Account and go to your ${LoginProviders[req.user.flgLogin]} Account settings.`);
        }
        const updatedUser: User = await this.userService.updatePassword(req.user.sub, user);
        const { password, ...restOfData } = updatedUser;
        return restOfData;
    }

    async deleteProfile(req: any,): Promise<AuthResponseDto> {
        const deletedUser: User = await this.userService.softDelete(req.user.sub);
        const { password, ...restOfData } = deletedUser;
        return restOfData;
    }

    async refreshJWT(req: any): Promise<RefreshJwtResponseDto> {
        const { iat, exp, ...payload } = req.user;
        return {
            refresh_token: await this.jwtService.signAsync({ ...payload }, {
                expiresIn: this.configService.get<string>(REFRESH_TOKEN_EXPIRES_IN),
            }),
        };
    }
}
