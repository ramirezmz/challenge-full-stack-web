/*
  Warnings:

  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'admin');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('active', 'canceled', 'finished');

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "active",
DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT,
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "Team";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "registration_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RegistrationStatus" NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
