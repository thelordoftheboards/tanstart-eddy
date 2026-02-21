ALTER TABLE "tanstart_eddy_examples_horse" RENAME COLUMN "color-and-markings" TO "color";--> statement-breakpoint
ALTER TABLE "tanstart_eddy_examples_horse" ADD COLUMN "markings" jsonb NOT NULL;