CREATE TABLE `course_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileSize` int,
	`mimeType` varchar(100),
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_files_id` PRIMARY KEY(`id`)
);
