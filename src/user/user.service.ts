import { BadRequestException, InternalServerErrorException, NotFoundException, Injectable } from '@nestjs/common';
import { User, UserStatus } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, 'security')
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
            return await this.userRepository.save({
                ...user,
            });
        } catch (error) {
            throw new InternalServerErrorException('There was an error while creating user');
        }
    }

    async update(user: any, id: number): Promise<User | undefined> {
        let foundUser: User = await this.findById(id);
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        if (foundUser.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User account was suspended');
        }
        try {
            await this.userRepository.update(id, {
                ...user,
            });
            return await this.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('There was an error while updating user');
        }
    }

    async updatePassword(user: any, id: number): Promise<User | undefined> {
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
                ...user,
            });
            return await this.findById(id);
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
            return await this.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('There was an error while deleting user');
        }
    }
}
