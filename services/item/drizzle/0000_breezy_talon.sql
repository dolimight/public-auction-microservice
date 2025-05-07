CREATE SCHEMA "item";
--> statement-breakpoint
CREATE TABLE "item"."category" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item"."condition" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item"."item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"shortDescription" text NOT NULL,
	"longDescription" text NOT NULL,
	"categoryId" integer NOT NULL,
	"subCategoryId" integer NOT NULL,
	"startingBid" real NOT NULL,
	"buyNowPrice" real,
	"bidIncrement" real NOT NULL,
	"startDate" timestamp with time zone NOT NULL,
	"endDate" timestamp with time zone NOT NULL,
	"sellerId" uuid NOT NULL,
	"conditionId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item"."subCategory" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item"."item" ADD CONSTRAINT "item_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "item"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item"."item" ADD CONSTRAINT "item_subCategoryId_category_id_fk" FOREIGN KEY ("subCategoryId") REFERENCES "item"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item"."item" ADD CONSTRAINT "item_conditionId_condition_id_fk" FOREIGN KEY ("conditionId") REFERENCES "item"."condition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "search_index" ON "item"."item" USING gin ((
        setweight(to_tsvector('english', "title"), 'A') ||
        setweight(to_tsvector('english', "shortDescription"), 'B') ||
        setweight(to_tsvector('english', "longDescription"), 'C')
      ));