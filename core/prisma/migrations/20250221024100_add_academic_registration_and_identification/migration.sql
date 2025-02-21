/*
  Warnings:

  - You are about to drop the column `birthday` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "birthday",
DROP COLUMN "phone",
ADD COLUMN     "academic_registration" TEXT,
ADD COLUMN     "identification" TEXT;
