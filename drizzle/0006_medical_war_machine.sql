ALTER TABLE `users` ADD `discordId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_discordId_unique` UNIQUE(`discordId`);