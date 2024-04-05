/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - Made the column `code` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `book_code` on table `borrow` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `borrow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `books` MODIFY `code` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `borrow` MODIFY `book_code` VARCHAR(100) NOT NULL,
    MODIFY `username` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `books_code_key` ON `books`(`code`);

-- AddForeignKey
ALTER TABLE `borrow` ADD CONSTRAINT `borrow_book_code_fkey` FOREIGN KEY (`book_code`) REFERENCES `books`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrow` ADD CONSTRAINT `borrow_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
