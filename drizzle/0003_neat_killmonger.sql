ALTER TABLE `course_materials` ADD `video1Title` varchar(255);--> statement-breakpoint
ALTER TABLE `course_materials` ADD `video1Url` text;--> statement-breakpoint
ALTER TABLE `course_materials` ADD `video2Title` varchar(255);--> statement-breakpoint
ALTER TABLE `course_materials` ADD `video2Url` text;--> statement-breakpoint
ALTER TABLE `course_materials` DROP COLUMN `videoUrl`;