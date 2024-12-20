-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "Permission"[] DEFAULT ARRAY[]::"Permission"[];
