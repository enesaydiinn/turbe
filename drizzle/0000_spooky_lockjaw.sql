CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`application_type` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country_city` text NOT NULL,
	`institution` text NOT NULL,
	`profession` text NOT NULL,
	`academic_title` text NOT NULL,
	`topic` text NOT NULL,
	`paper_title` text NOT NULL,
	`panel_title` text,
	`abstract_text` text NOT NULL,
	`published_before` text NOT NULL,
	`speakers_json` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_applications_type` ON `applications` (`application_type`);--> statement-breakpoint
CREATE INDEX `idx_applications_created_at` ON `applications` (`created_at`);