import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserStatus } from 'src/user/entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(user: LoginDto): Promise<JwtResponseDto> {
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
            username: foundUser.username
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(user: SignUpDto): Promise<JwtResponseDto> {
        const createdUser = await this.userService.create(user);
        const payload = {
            sub: createdUser.userId,
            username: createdUser.username
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getProfile(username: string): Promise<AuthResponseDto> {
        const foundUser = await this.userService.findOne(username);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        if (foundUser.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User account was suspended');
        }
        const { password, creationDate, createdBy, modifiedDate, modifiedBy, ...restOfData } = foundUser;
        return restOfData;
    }

    async updateProfile(user: UpdateProfileDto, id: string): Promise<AuthResponseDto> {
        const updatedUser = await this.userService.update(user, +id);
        const { password, creationDate, createdBy, modifiedDate, modifiedBy, ...restOfData } = updatedUser;
        return restOfData;
    }

    async updatePassword(user: UpdatePasswordDto, id: string): Promise<AuthResponseDto> {
        const updatedUser = await this.userService.updatePassword(user, +id);
        const { password, creationDate, createdBy, modifiedDate, modifiedBy, ...restOfData } = updatedUser;
        return restOfData;
    }

    async deleteProfile(id: string): Promise<AuthResponseDto> {
        const deletedUser = await this.userService.softDelete(+id);
        const { password, creationDate, createdBy, modifiedDate, modifiedBy, ...restOfData } = deletedUser;
        return restOfData;
    }
}
