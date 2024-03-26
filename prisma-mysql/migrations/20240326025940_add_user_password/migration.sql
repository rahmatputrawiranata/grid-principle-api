-- add password into users table

ALTER TABLE `users` ADD COLUMN `password` VARCHAR(191) NOT NULL;
