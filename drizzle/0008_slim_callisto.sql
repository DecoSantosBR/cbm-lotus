ALTER TABLE `users` ADD `studentId` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `profileCompleted` int DEFAULT 0 NOT NULL;