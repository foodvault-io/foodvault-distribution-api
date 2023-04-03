/*
  Warnings:

  - The values [super] on the enum `roleEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "roleEnum_new" AS ENUM ('admin', 'restaurant', 'user');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "roleEnum_new"[] USING ("role"::text::"roleEnum_new"[]);
ALTER TYPE "roleEnum" RENAME TO "roleEnum_old";
ALTER TYPE "roleEnum_new" RENAME TO "roleEnum";
DROP TYPE "roleEnum_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT ARRAY['user']::"roleEnum"[];
COMMIT;
