import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../models/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../models/user/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { LoginProviders, UserStatus } from "../common/enums/enums";
import { SignUpDto } from "./dto/sign-up.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';

const originalPassword: string = '123456';
const mockLoginUser: LoginDto = {
    username: 'test',
    password: originalPassword,
};
const mockUserList: User[] = [{
    userId: 1,
    username: 'test',
    password: '$2b$10$Tu2U8wCTYPLdTHzgamSGDOx.Gdhs5IcBkne0/IEWArnKE0RNqOnhG',
    picture: 'http://www.example.com/test.png',
    firstName: 'Test',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    flgLogin: LoginProviders.DEFAULT,
    creationDate: new Date(),
    createdBy: 'mock',
    modifiedDate: null,
    modifiedBy: null
}];
const mockUser: User = {
    userId: 1,
    username: 'test',
    password: '$2b$10$Tu2U8wCTYPLdTHzgamSGDOx.Gdhs5IcBkne0/IEWArnKE0RNqOnhG',
    picture: 'http://www.example.com/test.png',
    firstName: 'Test',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    flgLogin: LoginProviders.DEFAULT,
    creationDate: new Date(),
    createdBy: 'mock',
    modifiedDate: null,
    modifiedBy: null
};
let mockCreatedUser: SignUpDto = {
    username: 'test_1',
    password: '$2b$10$Tu2U8wCTYPLdTHzgamSGDOx.Gdhs5IcBkne0/IEWArnKE0RNqOnhG',
    picture: 'http://www.example.com/test_1.png',
    firstName: 'Test 1',
    lastName: 'User 1'
};
let mockUpdatedUser: any = {
    userId: 2,
    username: 'test_1',
    password: '$2b$10$Tu2U8wCTYPLdTHzgamSGDOx.Gdhs5IcBkne0/IEWArnKE0RNqOnhG',
    picture: 'http://www.example.com/test_1_edited.png',
    firstName: 'Test 1 edited',
    lastName: 'User 1 edited'
};

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UserService,
                {
                    provide: getRepositoryToken(User, 'security'),
                    useValue: {
                        findById: jest.fn().mockResolvedValue(mockUser),
                        findOne: jest.fn().mockResolvedValue(mockUser),
                        save: jest.fn().mockResolvedValue({
                            ...mockCreatedUser,
                            userId: mockUser.userId + 1,
                            status: UserStatus.ACTIVE,
                            flgLogin: LoginProviders.DEFAULT,
                            creationDate: new Date(),
                            createdBy: 'mock',
                            modifiedDate: null,
                            modifiedBy: null
                        }),
                        create: jest.fn().mockResolvedValue({
                            ...mockCreatedUser,
                            userId: mockUser.userId + 1,
                            status: UserStatus.ACTIVE,
                            flgLogin: LoginProviders.DEFAULT,
                            creationDate: new Date(),
                            createdBy: 'mock',
                            modifiedDate: null,
                            modifiedBy: null
                        }),
                        update: jest.fn().mockResolvedValue({
                            ...mockUpdatedUser,
                            userId: mockUser.userId + 1,
                            status: UserStatus.ACTIVE,
                            flgLogin: LoginProviders.DEFAULT,
                            creationDate: new Date(),
                            createdBy: 'mock',
                            modifiedDate: new Date(),
                            modifiedBy: 'mock'
                        }),
                        remove: jest.fn().mockResolvedValue(mockUser),
                    }
                },
                JwtService,
                ConfigService
            ],
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
    });

    it('shold be defined', () => {
        expect(authService).toBeDefined();
        expect(userService).toBeDefined();
    });

    describe('signInJWT', () => {
        it('should find user by username', async () => {
            const foundUser: User = await userService.findOne(mockLoginUser.username);
            expect(foundUser).toEqual(mockUser);
        });
        it('should passwords matches', async () => {
            const foundUser: User = await userService.findOne(mockLoginUser.username);
            const passwordMatches: boolean = await bcrypt.compare(mockLoginUser.password, foundUser.password);
            expect(passwordMatches).toBeTruthy();
        });
        it('should have ACTIVE status', async () => {
            const foundUser: User = await userService.findOne(mockLoginUser.username);
            const activeStatus = 'A';
            expect(foundUser.status).toBe(activeStatus);
        });
    });

    describe('signUpJWT', () => {
        it('should not already exists', async () => {
            const foundUser = await userService.findOne(mockCreatedUser.username);
            expect(foundUser.username).not.toStrictEqual(mockCreatedUser.username);
        });
        it('should create user', async () => {
            const createdUser = await userService.create(mockCreatedUser);
            expect(createdUser).not.toBeUndefined();
            expect(createdUser).toHaveProperty('userId', mockUser.userId + 1);
        });
    });
});