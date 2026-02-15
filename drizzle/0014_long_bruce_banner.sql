CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`discordId` varchar(64),
	`studentName` varchar(255) NOT NULL,
	`studentId` varchar(100) NOT NULL,
	`courseId` int,
	`courseName` varchar(255) NOT NULL,
	`instructorName` varchar(255) NOT NULL,
	`instructorRank` varchar(100) NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`issuedBy` int NOT NULL,
	`certificateUrl` text,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`)
);
