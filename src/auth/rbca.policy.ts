import { RolesBuilder } from "nest-access-control";
import { RoleEnum } from "@prisma/client";

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();
RBAC_POLICY
    .grant(RoleEnum.USER)
        .updateOwn('user')
        .deleteOwn('user')
        .readOwn('user')
        .readOwn('restaurant')
    .grant(RoleEnum.RESTAURANT)
        .extend(RoleEnum.USER)
        .createOwn('user')
        .createOwn('restaurant')
        .updateOwn('restaurant')
        .deleteOwn('restaurant')
    .grant(RoleEnum.ADMIN)
        .extend(RoleEnum.RESTAURANT)
        .create('user')
        .update('user')
        .delete('user')
        .readAny('user')
        .deleteAny('restaurant')
        .updateAny('restaurant')
        .readAny('restaurant')
        .createAny('restaurant')
