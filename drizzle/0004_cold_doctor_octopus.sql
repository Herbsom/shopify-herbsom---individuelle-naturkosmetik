CREATE TABLE `subscriptionOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`shopifyOrderId` varchar(255) NOT NULL,
	`stripeInvoiceId` varchar(255),
	`status` enum('pending','created','failed','cancelled') NOT NULL DEFAULT 'pending',
	`totalCents` int NOT NULL,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptionOrders_id` PRIMARY KEY(`id`)
);
