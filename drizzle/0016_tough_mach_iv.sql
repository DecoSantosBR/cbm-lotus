ALTER TABLE `certificates` MODIFY COLUMN `courseId` varchar(36);--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;