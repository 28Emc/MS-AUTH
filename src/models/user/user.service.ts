import { BadRequestException, InternalServerErrorException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from 'src/common/enums/enums';
import { User } from './entities/user.entity';
import { SECURITY } from 'src/common/constants/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, SECURITY)
        private readonly userRepository: Repository<User>,
    ) { }

    async findById(id: number): Promise<User | undefined> {
        try {
            return await this.userRepository
                .createQueryBuilder('user')
                .where({ userId: id })
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException('There was an error while fetching user by id');
        }
    }

    async findOne(username: string): Promise<User | undefined> {
        try {
            return await this.userRepository
                .createQueryBuilder('user')
                .where({ username: username })
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException('There was an error while fetching user by username');
        }
    }

    async create(user: any): Promise<User | undefined> {
        let foundUser: User = await this.findOne(user.username);
        if (foundUser) {
            throw new BadRequestException('User already exists');
        }
        try {
            user.password = await bcrypt.hash(user.password, 10);
            let picture = 'https://picsum.photos/200'; // TODO: CAMBIAR POR UN SERVICIO DE CARGA DE IMÁGENES Y DEVOLVER LA URL
            if (!user.picture || user.picture === '') {
                user.picture = picture;
            }
            return await this.userRepository.save({
                ...user,
            });
        } catch (error) {
            throw new InternalServerErrorException('There was an error while creating user');
        }
    }

    async update(id: number, user: any): Promise<User | undefined> {
        let foundUser: User = await this.findById(id);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        try {
            await this.userRepository.update(id, {
                ...user,
                picture: foundUser.picture
            });
            return await this.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('There was an error while updating user');
        }
    }

    async updatePassword(id: number, user: any): Promise<User | undefined> {
        let foundUser: User = await this.findById(id);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        if (foundUser.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User account was suspended');
        }
        const isMatch = await bcrypt.compare(user.currentPassword, foundUser.password);
        if (!isMatch) {
            throw new BadRequestException('Passwords not match');
        }
        try {
            foundUser.password = await bcrypt.hash(user.newPassword, 10);
            await this.userRepository.update(id, {
                ...foundUser,
            });
            return foundUser;
        } catch (error) {
            throw new InternalServerErrorException('There was an error while updating user');
        }
    }

    async softDelete(id: number): Promise<User | undefined> {
        let foundUser: User = await this.findById(id);
        if (!foundUser) {
            throw new BadRequestException('User not found');
        }
        if (foundUser.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User account was already suspended');
        }
        try {
            foundUser.status = UserStatus.INACTIVE;
            await this.userRepository.update(id, {
                ...foundUser,
            });
            return foundUser;
        } catch (error) {
            throw new InternalServerErrorException('There was an error while deleting user');
        }
    }
}
