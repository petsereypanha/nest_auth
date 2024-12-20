/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classrooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lessons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnClassroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teachers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_classId_fkey";

-- DropForeignKey
ALTER TABLE "Assignments" DROP CONSTRAINT "Assignments_classId_fkey";

-- DropForeignKey
ALTER TABLE "Assignments" DROP CONSTRAINT "Assignments_createBy_fkey";

-- DropForeignKey
ALTER TABLE "Assignments" DROP CONSTRAINT "Assignments_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Attendances" DROP CONSTRAINT "Attendances_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Attendances" DROP CONSTRAINT "Attendances_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Classrooms" DROP CONSTRAINT "Classrooms_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_classId_fkey";

-- DropForeignKey
ALTER TABLE "Exams" DROP CONSTRAINT "Exams_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Lessons" DROP CONSTRAINT "Lessons_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "OnClassroom" DROP CONSTRAINT "OnClassroom_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "OnClassroom" DROP CONSTRAINT "OnClassroom_userId_fkey";

-- DropForeignKey
ALTER TABLE "Parents" DROP CONSTRAINT "Parents_userId_fkey";

-- DropForeignKey
ALTER TABLE "Results" DROP CONSTRAINT "Results_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Results" DROP CONSTRAINT "Results_examId_fkey";

-- DropForeignKey
ALTER TABLE "Results" DROP CONSTRAINT "Results_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_classId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teachers" DROP CONSTRAINT "Teachers_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Announcement";

-- DropTable
DROP TABLE "Assignments";

-- DropTable
DROP TABLE "Attendances";

-- DropTable
DROP TABLE "Classrooms";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Exams";

-- DropTable
DROP TABLE "Grade";

-- DropTable
DROP TABLE "Lessons";

-- DropTable
DROP TABLE "OnClassroom";

-- DropTable
DROP TABLE "Parents";

-- DropTable
DROP TABLE "Results";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "Students";

-- DropTable
DROP TABLE "Teachers";
