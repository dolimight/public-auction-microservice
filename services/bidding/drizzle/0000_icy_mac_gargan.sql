CREATE SCHEMA "bidding";
--> statement-breakpoint
CREATE TABLE "bidding"."bids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"itemId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"amount" real NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
