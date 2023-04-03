import { RolesBuilder } from "nest-access-control";
import { RoleEnum } from "@prisma/client";

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();
RBAC_POLICY
    .grant(RoleEnum.USER)
        .updateOwn('user')
        .deleteOwn('user')
        .readOwn('user')
    .grant(RoleEnum.RESTAURANT)
        .extend(RoleEnum.USER)
        .createOwn('user')
        .createOwn('restaurant')
        .updateOwn('restaurant')
        .deleteOwn('restaurant')
        .readOwn('restaurant')
    .grant(RoleEnum.ADMIN)
        .extend(RoleEnum.RESTAURANT)
        .createAny('user')
        .updateAny('user')
        .deleteAny('user')
        .readAny('user')
        .deleteAny('restaurant')
        .updateAny('restaurant')
        .readAny('restaurant')
        .createAny('restaurant')
