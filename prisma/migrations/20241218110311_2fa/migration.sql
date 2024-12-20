/*
  Warnings:

  - You are about to drop the `TwoFactorConfirmation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactorToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TwoFactorConfirmation" DROP CONSTRAINT "TwoFactorConfirmation_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorSecret" TEXT;

-- DropTable
DROP TABLE "TwoFactorConfirmation";

-- DropTable
DROP TABLE "TwoFactorToken";
