CREATE TABLE `course_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`nomeCompleto` varchar(255) NOT NULL,
	`idJogador` varchar(100) NOT NULL,
	`telefone` varchar(50) NOT NULL,
	`horarioDisponivel` text NOT NULL,
	`status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`instructions` text,
	`videoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`valor` varchar(50),
	`requisitos` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
