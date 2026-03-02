CREATE TYPE "public"."role_enum" AS ENUM('admin', 'writer', 'user');--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"displayName" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"profileImage" text,
	"role" "role_enum" DEFAULT 'user' NOT NULL,
	"canEditUser" boolean DEFAULT false,
	"canMakeArticle" boolean DEFAULT false,
	"canMakeCard" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
