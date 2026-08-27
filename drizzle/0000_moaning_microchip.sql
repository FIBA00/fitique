CREATE TABLE `fitCheckResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`photoKey` varchar(512) NOT NULL,
	`photoUrl` varchar(1024) NOT NULL,
	`productId` varchar(96) NOT NULL,
	`productName` varchar(160) NOT NULL,
	`recommendedSize` varchar(16) NOT NULL,
	`confidence` varchar(16) NOT NULL,
	`fitSummary` text NOT NULL,
	`considerations` text NOT NULL,
	`styleTip` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fitCheckResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fitProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`preferredSize` varchar(16),
	`height` varchar(32),
	`bodyShape` varchar(48),
	`stylePreferences` text,
	`fitNotes` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fitProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `fitProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `fitCheckResults` ADD CONSTRAINT `fitCheckResults_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fitProfiles` ADD CONSTRAINT `fitProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;