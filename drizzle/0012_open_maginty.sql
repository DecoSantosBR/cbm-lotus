ALTER TABLE `course_enrollments` MODIFY COLUMN `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'confirmed';--> statement-breakpoint
ALTER TABLE `course_enrollments` ADD `eventId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `course_enrollments` DROP COLUMN `courseId`;