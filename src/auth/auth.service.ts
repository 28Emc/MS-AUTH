import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User, UserStatus } from 'src/user/entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { RefreshJwtResponseDto } from './dto/refresh-jwt-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async signIn(user: LoginDto): Promise<any> {
        const foundUser = await this.userService.findOne(user.username);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        const isMatch = await bcrypt.compare(user.password, foundUser.password);
        if (!isMatch) {
            throw new BadRequestException('Incorrect user or password');
        }
        if (foundUser.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User account was suspended');
        }
        const { password, ...restOfData } = foundUser;
        return restOfData;
    }

    async signInJWT(user: LoginDto): Promise<JwtResponseDto> {
        const foundUser = await this.userService.findOne(user.username);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        const isMatch = await bcrypt.compare(user.password, foundUser.password);
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
            flgLogin: foundUser.flgLogin,
            creationDate: foundUser.creationDate,
            createdBy: foundUser.createdBy,
            modifiedDate: foundUser.modifiedDate,
            modifiedBy: foundUser.modifiedBy,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(user: SignUpDto): Promise<User> {
        return await this.userService.create(user);
    }

    async signUpJWT(user: SignUpDto): Promise<JwtResponseDto> {
        const createdUser = await this.signUp(user);
        const payload = {
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
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getProfile(req: any): Promise<AuthResponseDto> {
        const foundUser = await this.userService.findById(req.user.sub);
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
        const updatedUser = await this.userService.update(req.user.sub, user);
        const { password, ...restOfData } = updatedUser;
        return restOfData;
    }

    async updatePassword(req: any, user: UpdatePasswordDto): Promise<AuthResponseDto> {
        const updatedUser = await this.userService.updatePassword(req.user.sub, user);
        const { password, ...restOfData } = updatedUser;
        return restOfData;
    }

    async deleteProfile(req: any,): Promise<AuthResponseDto> {
        const deletedUser = await this.userService.softDelete(req.user.sub);
        const { password, ...restOfData } = deletedUser;
        return restOfData;
    }

    async refreshJWT(req: any): Promise<RefreshJwtResponseDto> {
        const { iat, exp, ...payload } = req.user;
        return {
            refresh_token: await this.jwtService.signAsync({ ...payload }, {
                expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN')
            }),
        };
    }
}
