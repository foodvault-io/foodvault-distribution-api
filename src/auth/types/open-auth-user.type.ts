import { RoleEnum } from "@prisma/client";

export type OAuthUser = {
    providerAccountId: string;
    provider: string;
    firstName: string;
    lastName: string;
    email: string;
    emailValidated?: boolean;
    photo?: string;
    accessToken?: string;
    refreshToken?: string;
    role?: RoleEnum;
}