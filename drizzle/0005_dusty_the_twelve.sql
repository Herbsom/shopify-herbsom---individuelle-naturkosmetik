CREATE TABLE `shopifyCustomerAuthStates` (
	`state` varchar(128) NOT NULL,
	`encryptedVerifier` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shopifyCustomerAuthStates_state` PRIMARY KEY(`state`)
);
--> statement-breakpoint
CREATE TABLE `shopifyCustomerSessions` (
	`id` varchar(128) NOT NULL,
	`customerId` varchar(255),
	`encryptedAccessToken` text NOT NULL,
	`encryptedRefreshToken` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shopifyCustomerSessions_id` PRIMARY KEY(`id`)
);
