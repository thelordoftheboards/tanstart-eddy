CREATE TABLE "base_email_received_email" (
	"id" uuid PRIMARY KEY NOT NULL,
	"from" text NOT NULL,
	"email_id" text NOT NULL,
	"webhook_payload_email_received_json" text NOT NULL,
	"content_json" text,
	"processing_status" integer NOT NULL,
	"received_on" timestamp NOT NULL,
	"processed_on" timestamp
);
--> statement-breakpoint
CREATE INDEX "base_email_received_email_from_idx" ON "base_email_received_email" USING btree ("from");--> statement-breakpoint
CREATE UNIQUE INDEX "base_email_received_email_message_id_idx" ON "base_email_received_email" USING btree ("email_id");