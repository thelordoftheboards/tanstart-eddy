CREATE TABLE "example-one-race-horse" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"breed" text NOT NULL,
	"birth-year" integer NOT NULL,
	"color-and-markings" text NOT NULL,
	"stall-number" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "example-one-race-horse" ADD CONSTRAINT "example-one-race-horse_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;