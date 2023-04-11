import { RoleEnum } from '@prisma/client';
import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsEnum,
} from 'class-validator';

export class LocalAuthDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEnum(
        RoleEnum,
    )
    role: RoleEnum;
}