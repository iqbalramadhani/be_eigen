/*
  Warnings:

  - You are about to drop the column `books_id` on the `borrow` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `borrow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `borrow` DROP COLUMN `books_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `book_code` VARCHAR(100) NULL,
    ADD COLUMN `username` VARCHAR(100) NULL;
