ALTER TABLE `course_applications` MODIFY COLUMN `courseId` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `course_files` MODIFY COLUMN `courseId` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `course_images` MODIFY COLUMN `courseId` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `course_materials` MODIFY COLUMN `courseId` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `id` varchar(36) NOT NULL;