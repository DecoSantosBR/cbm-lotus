CREATE TABLE `course_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`caption` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_images_id` PRIMARY KEY(`id`)
);
