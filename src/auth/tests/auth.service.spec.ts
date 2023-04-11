import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthDto, LocalSignInDto } from '../dto';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoleEnum, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { OAuthUser, Token, Tokens } from '../types';
import { GoogleStrategy } from '../strategies';
import { PassportModule } from '@nestjs/passport';

// Users:
const id = uuidv4();
const userEmail1 = 'john_doe@gmail.com';
const userFirstName1 = 'John';
const userLastName1 = 'Doe';
const userPassword1 = 'password';

const userArray = [
    { id, email: userEmail1, firstName: userFirstName1, lastName: userLastName1, password: userPassword1 },
    { id, email: 'thor@gmail.com', firstName: 'Thor', lastName: 'Chevres', password: 'password' },
    { id, email: 'johanna@gmail.com', firstName: 'Johanna', lastName: 'DeLuca', password: 'password' },
];

const oneUser = userArray[0];
const createUser = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: 'user@example.com', firstName: userFirstName1, lastName: userLastName1, hashedPassword: argon2.hash('password'), image: null, role: RoleEnum.USER, }
const user1 = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: userEmail1, firstName: userFirstName1, lastName: userLastName1, hashedPassword: argon2.hash(userPassword1), image: 'image.jpn', role: RoleEnum.USER, }

// Accounts: 
const accountId = uuidv4();
const userId = id;
const providerType = 'email';
const provider = 'local';
const providerAccountId = userEmail1;
const accessToken = 'accessToken';
const refreshToken = 'refreshToken';
const accessTokenExpires: number = 60 * 15;
const tokenType = 'Bearer';

const accountArray = [
    {
        id: accountId,
        userId: 'a uuid',
        providerType: providerType,
        provider: provider,
        providerAccountId: providerAccountId,
        accessToken: accessToken,
        accessTokenExpires: accessTokenExpires,
        tokenType: tokenType,
        refreshToken: argon2.hash(refreshToken),

    }]

const oneAccount = accountArray[0];

const db = {
    user: {
        findMany: jest.fn().mockResolvedValue(userArray),
        findUnique: jest.fn().mockResolvedValue(oneUser),
        findFirst: jest.fn().mockResolvedValue(oneUser),
        create: jest.fn().mockReturnValue(createUser),
        save: jest.fn(),
        update: jest.fn().mockReturnValue(user1),
    },
    account: {
        findMany: jest.fn().mockResolvedValue(accountArray),
        findUnique: jest.fn().mockResolvedValue(oneAccount),
        findFirst: jest.fn().mockResolvedValue(oneAccount),
        create: jest.fn().mockReturnValue({
            id: accountId,
            userId: 'a uuid',
            providerType: providerType,
            provider: provider,
            providerAccountId: providerAccountId,
            accessToken: accessToken,
            accessTokenExpires: accessTokenExpires,
            tokenType: tokenType,
            refreshToken: argon2.hash(refreshToken),

        }),
        update: jest.fn().mockReturnValue(oneAccount),
        updateMany: jest.fn().mockReturnValue(accountArray),
        save: jest.fn(),
    }
}

describe('AuthService', () => {
    let service: AuthService;
    let prisma: PrismaService;
    let config: ConfigService;
    let jwtService: JwtService;
    let google: GoogleStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule],
            providers: [
                AuthService,
                ConfigService,
                JwtService,
                {
                    provide: PrismaService,
                    useValue: db,
                },
                GoogleStrategy,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
        config = module.get<ConfigService>(ConfigService);
        google = module.get<GoogleStrategy>(GoogleStrategy);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser()', () => {
        it('should create a user', async () => {
            const user = await service.createUser({
                email: userEmail1,
                firstName: userFirstName1,
                lastName: userLastName1,
                password: userPassword1,
                role: RoleEnum.USER,
            });
            expect(user).toEqual(createUser);
        });
    });

    describe('findOneById() & findOneByEmail()', () => {

        it('should find a user by id', async () => {
            expect(service.findOneById('a uuid')).resolves.toEqual(oneUser);
        });

        it('should find a user by email', async () => {
            expect(service.findOneByEmail(userEmail1)).resolves.toEqual(oneUser);
        });
    });

    describe('signUpLocally()', () => {
        it('should create a new user, account and tokens', async () => {
            const localAuthDto: LocalAuthDto = {
                email: userEmail1,
                firstName: userFirstName1,
                lastName: userLastName1,
                password: userPassword1,
                role: RoleEnum.USER,
            };
            const tokens = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
            }
            const user = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: userEmail1, firstName: userFirstName1, lastName: userLastName1, hashedPassword: await argon2.hash(userPassword1), image: null, role: RoleEnum.USER, }

            jest.spyOn(service, 'createUser').mockResolvedValueOnce(user);
            jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens);
            jest.spyOn(service, 'updateRefreshTokenHashLocal').mockResolvedValueOnce();

            const result = await service.signUpLocally(localAuthDto);

            expect(result).toEqual(tokens);
            expect(service.updateRefreshTokenHashLocal).toHaveBeenCalledWith(user.id, tokens.refreshToken);
        });

        it('should throw BadRequestException if email already exists', async () => {
            const localAuthDto: LocalAuthDto = {
                email: userEmail1,
                firstName: userFirstName1,
                lastName: userLastName1,
                password: userPassword1,
                role: RoleEnum.USER,
            };

            const error = new Error('P2002');
            error['code'] = 'P2002';

            jest.spyOn(service, 'createUser').mockRejectedValueOnce(error);

            await expect(service.signUpLocally(localAuthDto)).rejects.toThrowError(BadRequestException);
        });

        it('should throw InternalServerErrorException if error is not P2002', async () => {
            const localAuthDto: LocalAuthDto = {
                email: userEmail1,
                firstName: userFirstName1,
                lastName: userLastName1,
                password: userPassword1,
                role: RoleEnum.USER,
            };

            const error = new Error;

            jest.spyOn(service, 'createUser').mockRejectedValueOnce(error);

            await expect(service.signUpLocally(localAuthDto)).rejects.toThrowError(Error);
        });
    });

    describe('signInLocally()', () => {
        it('should sign in a user locally', async () => {
            const localSignInDto: LocalSignInDto = {
                email: 'user@example.com',
                password: 'password',
            };

            const user = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: 'user@example.com', firstName: userFirstName1, lastName: userLastName1, hashedPassword: await argon2.hash('password'), image: null, role: RoleEnum.USER, }
            const tokens = { accessToken: 'accessToken', refreshToken: 'refreshToken' };
            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(user);
            service.getTokens = jest.fn().mockResolvedValueOnce(tokens);
            service.updateRefreshTokenHashLocal = jest.fn();
            jest.fn(argon2.verify).mockResolvedValueOnce(true);
            const result = await service.signInLocally(localSignInDto.email, localSignInDto.password);

            expect(result).toEqual(tokens);
        });

        it('should throw NotFoundException when user is not found', async () => {
            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(null);

            await expect(
                service.signInLocally('user@example.com', 'password')
            ).rejects.toThrowError(new NotFoundException('User not Found'));
        });

        it('should throw ForbiddenException when password is incorrect', async () => {
            const user = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: 'user@example.com', firstName: userFirstName1, lastName: userLastName1, hashedPassword: await argon2.hash('password'), image: null, role: RoleEnum.USER, }
            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(user);
            jest.fn(argon2.verify).mockResolvedValueOnce(false);

            await expect(
                service.signInLocally('user@example.com', 'incorrect')
            ).rejects.toThrowError(new ForbiddenException('Invalid Password'));
        });
    });

    describe('updateRefreshTokenHashLocal()', () => {
        it('should update the refresh token hash for a given user', async () => {
            const user = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: 'user@example.com', firstName: userFirstName1, lastName: userLastName1, hashedPassword: await argon2.hash('password'), image: null, role: RoleEnum.USER, }
            const account = {
                id: 'a uuid',
                userId: user.id,
                providerType: providerType,
                provider: provider,
                status: UserStatus.ACTIVE,
                providerAccountId: providerAccountId,
                accessToken: accessToken,
                accessTokenExpires: accessTokenExpires,
                tokenType: tokenType,
                refreshToken: await argon2.hash(refreshToken),
            }

            jest.spyOn(service, 'findOneById').mockResolvedValueOnce(user);
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValueOnce(account);
            const newRefreshToken = 'new-refresh-token';
            const hashedPassword = await argon2.hash(newRefreshToken);
            const updatedAccount = { ...account, refreshToken: hashedPassword }
            jest.spyOn(prisma.account, 'update').mockResolvedValueOnce(updatedAccount);
            await service.updateRefreshTokenHashLocal(user.id, newRefreshToken);

            const result = await argon2.verify(updatedAccount.refreshToken, newRefreshToken);
            expect(result).toBe(true);
        });
        it('should throw NotFoundException when User is not found', async () => {
            jest.spyOn(service, 'findOneById').mockResolvedValue(null);

            try {
                await service.updateRefreshTokenHashLocal(userId, refreshToken);
            } catch (error) {
                expect(error.message).toEqual(new NotFoundException('User not Found').message);
            }
        });

        it('should throw NotFoundException when Account is not found', async () => {
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValueOnce(null);
            try {
                await service.updateRefreshTokenHashLocal(userId, refreshToken);
            } catch (error) {
                expect(error.message).toEqual(new NotFoundException('Account not Found').message);
            }
        });

    });

    describe('localLogout()', () => {
        it('should update all refresh tokens to null for a given user ID', async () => {
            // Arrange
            const userId = '1';

            // Act
            await service.localLogout(userId);

            // Assert
            expect(prisma.account.updateMany).toBeCalledWith({
                where: {
                    userId,
                    refreshToken: {
                        not: null,
                    },
                },
                data: {
                    refreshToken: null,
                },
            });
        });
    });

    describe('refreshToken()', () => {
        const userId = '1';
        const refreshToken = 'refresh-token';
        const hashedRefreshToken = 'hashed-refresh-token';
        const user = { id: userId, createdAt: new Date, updatedAt: new Date, deletedAt: null, email: 'user@example.com', firstName: userFirstName1, lastName: userLastName1, hashedPassword: 'password', image: null, role: RoleEnum.USER, };
        const account = {
            id: '1',
            userId: userId,
            providerType: providerType,
            provider: provider,
            status: UserStatus.ACTIVE,
            providerAccountId: providerAccountId,
            accessToken: accessToken,
            accessTokenExpires: accessTokenExpires,
            tokenType: tokenType,
            refreshToken: hashedRefreshToken,
        };

        beforeEach(() => {
            jest.spyOn(service, 'findOneById').mockResolvedValue(user);
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(account);
            jest.spyOn(argon2, 'verify').mockResolvedValue(true);
            jest.spyOn(service, 'getAccessToken').mockResolvedValue({ accessToken: 'new-access-token' } as any);
        });

        it('should throw an error if the user is not found', async () => {
            jest.spyOn(service, 'findOneById').mockResolvedValue(undefined);
            await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(NotFoundException);
        });

        it('should throw an error if the account is not found', async () => {
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(undefined);
            await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(NotFoundException);
        });

        it('should throw an error if the refresh token is invalid', async () => {
            jest.spyOn(argon2, 'verify').mockResolvedValue(false);
            await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(ForbiddenException);
        });

        it('should return a new access token if the refresh token is valid', async () => {
            const token = await service.refreshToken(userId, refreshToken);
            expect(token).toEqual({ accessToken: 'new-access-token' });
        });
    });

    describe('getTokens()', () => {
        it('should return an object with access and refresh tokens', async () => {
            const userId = 'testUserId';
            const email = 'test@test.com';
            const roles = 'user';
            const tokens: Tokens = {
                accessToken: 'testAccessToken',
                refreshToken: 'testRefreshToken',
            };

            jest.spyOn(jwtService, 'signAsync').mockImplementation((payload: any, options: any) => {
                if (options.expiresIn === 900) {
                    return Promise.resolve('testAccessToken');
                } else {
                    return Promise.resolve('testRefreshToken');
                }
            });

            const result = await service.getTokens(userId, email, roles);

            expect(result).toEqual(tokens);
            expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                {
                    userId: userId,
                    email: email,
                    roles: roles,
                },
                {
                    secret: config.get('AT_JWT_SECRET_KEY'),
                    expiresIn: 900,
                },
            );
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                {
                    userId: userId,
                    email: email,
                    roles: roles,
                },
                {
                    secret: config.get('RT_JWT_SECRET_KEY'),
                    expiresIn: 60 * 60 * 24 * 30, // 7 days
                },
            );
        });
    });

    describe('getAccessToken()', () => {
        it('should return an object with access tokens', async () => {
            const userId = 'testUserId';
            const email = 'test@test.com';
            const roles = 'user';
            const tokens: Token = {
                accessToken: 'testAccessToken',
            };

            jest.spyOn(jwtService, 'signAsync').mockImplementation((payload: any, options: any) => {
                if (options.expiresIn === 900) {
                    return Promise.resolve('testAccessToken');
                } else {
                    return Promise.resolve('testRefreshToken');
                }
            });

            const result = await service.getAccessToken(userId, email, roles);

            expect(result).toEqual(tokens);
            expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                {
                    userId: userId,
                    email: email,
                    roles: roles,
                },
                {
                    secret: config.get('AT_JWT_SECRET_KEY'),
                    expiresIn: 900,
                },
            );
        });
    });

    describe('googleLogin() ', () => {
        it('should be defined', () => {
            expect(google).toBeDefined();
        });

        it('Should Create a new User if its first time logging in and return tokens', async () => {
            const profile: OAuthUser = {
                providerId: '123456789',
                provider: 'google',
                firstName: 'User',
                lastName: 'Test',
                email: 'test@email.com',
                emailValidated: true,
                photo: null,
            };

            const user = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: userEmail1, firstName: userFirstName1, lastName: userLastName1, hashedPassword: await argon2.hash(userPassword1), image: null, role: RoleEnum.USER, }

            const tokens: Tokens = {
                accessToken: 'testAccessToken',
                refreshToken: 'testRefreshToken',
            };

            const account = {
                id: 'a uuid',
                userId: user.id,
                providerType: 'oauth-google',
                provider: 'google',
                status: UserStatus.ACTIVE,
                providerAccountId: '1234567',
                accessToken: tokens.accessToken,
                accessTokenExpires: accessTokenExpires,
                tokenType: tokenType,
                refreshToken: await argon2.hash(refreshToken),
            }


            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(null)
            jest.spyOn(argon2, 'hash').mockResolvedValueOnce('hashed-id')
            jest.spyOn(service, 'createUser').mockResolvedValueOnce(user)
            jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens)
            jest.spyOn(prisma.account, 'create').mockResolvedValueOnce(account)
            jest.spyOn(service, 'updateRefreshTokenHashLocal').mockResolvedValueOnce()

            const result = await service.socialLogin(profile);

            expect(result).toEqual(tokens);
        });

        it('Should return tokens if user already exists and signed in with Google before', async () => {
            const profile: OAuthUser = {
                providerId: '123456789',
                provider: 'google',
                firstName: 'User',
                lastName: 'Test',
                email: 'test@email.com',
                emailValidated: true,
                photo: null,
            };

            const user = { id: 'a uuid', createdAt: new Date, updatedAt: new Date, deletedAt: null, email: userEmail1, firstName: userFirstName1, lastName: userLastName1, hashedPassword: await argon2.hash(userPassword1), image: null, role: RoleEnum.USER, }

            const tokens: Tokens = {
                accessToken: 'testAccessToken',
                refreshToken: 'testRefreshToken',
            };

            const account = {
                id: 'a uuid',
                userId: user.id,
                providerType: 'oauth-google',
                provider: 'google',
                status: UserStatus.ACTIVE,
                providerAccountId: '123456789',
                accessToken: tokens.accessToken,
                accessTokenExpires: accessTokenExpires,
                tokenType: tokenType,
                refreshToken: await argon2.hash(refreshToken),
            }

            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(user)
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValueOnce(account)
            jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens)
            jest.spyOn(service, 'updateRefreshTokenHashLocal').mockResolvedValueOnce()

            const result = await service.socialLogin(profile);

            expect(result).toEqual(tokens);
        });

        it('Should throw an error if user already exists and signed in with Google before but the account is not found', async () => {
            const profile: OAuthUser = {
                providerId: '123456789',
                provider: 'google',
                firstName: 'User',
                lastName: 'Test',
                email: 'test@email.com',
                emailValidated: true,
                photo: null,
            };

            const user = {
                id: 'a uuid',
                createdAt: new Date,
                updatedAt: new Date,
                deletedAt: null,
                email: userEmail1,
                firstName: userFirstName1,
                lastName: userLastName1,
                hashedPassword: await argon2.hash(userPassword1),
                image: null,
                role: RoleEnum.USER
            }

            const tokens: Tokens = {
                accessToken: 'testAccessToken',
                refreshToken: 'testRefreshToken',
            };

            const facebookAccount = {
                id: 'a uuid',
                userId: user.id,
                providerType: 'oauth-google',
                provider: 'facebook',
                providerAccountId: '123456789',
                accessToken: tokens.accessToken,
                status: UserStatus.ACTIVE,
                accessTokenExpires: accessTokenExpires,
                tokenType: tokenType,
                refreshToken: await argon2.hash(refreshToken),
            }

            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(user)
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValueOnce(facebookAccount)
            jest.spyOn(service, 'getTokens').mockResolvedValueOnce(tokens)
            jest.spyOn(service, 'updateRefreshTokenHashLocal').mockResolvedValueOnce()

            await expect(service.socialLogin(profile)).rejects.toThrow(new BadRequestException('Previously signed up with facebook'));
        });

        it('Should throw an error if user already exists and signed in with Google before but the account is not found', async () => {
            const profile: OAuthUser = {
                providerId: '123456789',
                provider: 'google',
                firstName: 'User',
                lastName: 'Test',
                email: 'test@email.com',
                emailValidated: true,
                photo: null,
            };

            const user = {
                id: 'a uuid',
                createdAt: new Date,
                updatedAt: new Date,
                deletedAt: null,
                email: userEmail1,
                firstName: userFirstName1,
                lastName: userLastName1,
                hashedPassword: await argon2.hash(userPassword1),
                image: null,
                role: RoleEnum.USER
            }

            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(user)
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValueOnce(null)

            await expect(service.socialLogin(profile)).rejects.toThrow(new BadRequestException('Invalid Provider Account'));
        });

        it('Should throw an error if the providerId is not the same as the one in the database', async () => {
            const profile: OAuthUser = {
                providerId: '123456789',
                provider: 'google',
                firstName: 'User',
                lastName: 'Test',
                email: 'test@email.com',
                emailValidated: true,
                photo: null,
            };

            const user = {
                id: 'a uuid',
                createdAt: new Date,
                updatedAt: new Date,
                deletedAt: null,
                email: userEmail1,
                firstName: userFirstName1,
                lastName: userLastName1,
                hashedPassword: await argon2.hash(userPassword1),
                image: null,
                role: RoleEnum.USER
            }

            const tokens: Tokens = {
                accessToken: 'testAccessToken',
                refreshToken: 'testRefreshToken',
            };

            const incorrectAccount = {
                id: 'a uuid',
                userId: user.id,
                status: UserStatus.ACTIVE,
                providerType: 'oauth-google',
                provider: 'google',
                providerAccountId: '12345',
                accessToken: tokens.accessToken,
                accessTokenExpires: accessTokenExpires,
                tokenType: tokenType,
                refreshToken: await argon2.hash(refreshToken),
            }

            jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(user)
            jest.spyOn(prisma.account, 'findFirst').mockResolvedValueOnce(incorrectAccount)

            await expect(service.socialLogin(profile)).rejects.toThrow(new BadRequestException('Invalid Provider Account'));
        });
    });
});

