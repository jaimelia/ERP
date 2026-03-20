CREATE TYPE "payment_methods" AS ENUM (
	'CreditCard',
	'Cash',
	'CCE'
);

CREATE TYPE "transaction_status" AS ENUM (
	'accepted',
	'canceled',
	'inProgress'
);

CREATE TYPE "payment_status" AS ENUM (
	'accepted',
	'canceled'
);

CREATE TYPE "pump_charger_status" AS ENUM (
	'inUse',
	'available',
	'deactivated',
	'outOfOrder'
);

CREATE TYPE "cce_status" AS ENUM (
	'activated',
	'deactivated'
);

CREATE TYPE "restock_status" AS ENUM (
	'pending',
	'delivered',
	'canceled'
);

CREATE TYPE "document_status" AS ENUM (
	'pending',
	'sentToDR',
	'locked'
);


CREATE TYPE schedule AS (
	opening_time TIME,
	closing_time TIME
);


CREATE TABLE IF NOT EXISTS "transactions" (
	"id_transaction" INTEGER NOT NULL UNIQUE,
	"type" VARCHAR(255) NOT NULL,
	"transaction_date" DATE,
	"is_from_automat" BOOLEAN NOT NULL,
	"status" transaction_status NOT NULL,
	PRIMARY KEY("id_transaction")
);




CREATE TABLE IF NOT EXISTS "products" (
	"unit_price" NUMERIC(5,3) NOT NULL,
	"stock" INTEGER NOT NULL,
	"alert_threshold" INTEGER NOT NULL,
	"id_item" INTEGER NOT NULL,
	PRIMARY KEY("id_item")
);




CREATE TABLE IF NOT EXISTS "fuels" (
	"price_per_liter" NUMERIC(5,3) NOT NULL,
	"stock" NUMERIC(5,3),
	"alert_threshold" NUMERIC(5,3) NOT NULL,
	"id_item" INTEGER NOT NULL,
	PRIMARY KEY("id_item")
);




CREATE TABLE IF NOT EXISTS "pumps" (
	"id_pump" INTEGER NOT NULL UNIQUE,
	"is_automat" BOOLEAN NOT NULL,
	"status" pump_charger_status NOT NULL,
	PRIMARY KEY("id_pump")
);




CREATE TABLE IF NOT EXISTS "ev_chargers" (
	"id_ev_charger" INTEGER NOT NULL UNIQUE,
	"is_fast" BOOLEAN NOT NULL,
	"energy_available" NUMERIC(5,3) NOT NULL,
	"alert_threshold" NUMERIC(5,3),
	"status" pump_charger_status NOT NULL,
	PRIMARY KEY("id_ev_charger")
);




CREATE TABLE IF NOT EXISTS "clients" (
	"id_client" INTEGER NOT NULL UNIQUE,
	"firstname" VARCHAR(255) NOT NULL,
	"lastname" VARCHAR(255) NOT NULL,
	"mail" VARCHAR(255) NOT NULL,
	"phone_number" VARCHAR(20) NOT NULL,
	"id_cce_card" INTEGER NOT NULL,
	PRIMARY KEY("id_client")
);




CREATE TABLE IF NOT EXISTS "users" (
	"id_user" INTEGER NOT NULL UNIQUE,
	"username" VARCHAR(255) NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"email" VARCHAR(255) NOT NULL,
	"role" VARCHAR(255) NOT NULL,
	"uses_dark_mode" BOOLEAN NOT NULL,
	"tile_layout" JSONB NOT NULL,
	PRIMARY KEY("id_user")
);




CREATE TABLE IF NOT EXISTS "weekly_schedule" (
	"monday" SCHEDULE,
	"tuesday" SCHEDULE,
	"wednesday" SCHEDULE,
	"thursday" SCHEDULE,
	"friday" SCHEDULE,
	"saturday" SCHEDULE,
	"sunday" SCHEDULE
);




CREATE TABLE IF NOT EXISTS "cce_cards" (
	"id_cce_card" INTEGER NOT NULL UNIQUE,
	"balance" NUMERIC(5,3) NOT NULL,
	"created_at" DATE NOT NULL,
	"expires_at" DATE NOT NULL,
	"code" INTEGER NOT NULL,
	"minimum_credit_amount" INTEGER NOT NULL,
	"status" cce_status NOT NULL,
	PRIMARY KEY("id_cce_card")
);




CREATE TABLE IF NOT EXISTS "transactions_lines" (
	"id_transaction_line" INTEGER NOT NULL UNIQUE,
	"quantity" INTEGER NOT NULL,
	"id_transaction" INTEGER NOT NULL,
	"total_amount" NUMERIC(5,3),
	"id_item" INTEGER NOT NULL,
	PRIMARY KEY("id_transaction_line")
);




CREATE TABLE IF NOT EXISTS "pumps_fuels" (
	"id_pump_fuel" INTEGER NOT NULL UNIQUE,
	"id_fuel" INTEGER NOT NULL,
	"id_pump" INTEGER NOT NULL,
	"max_volume" NUMERIC(5,3),
	"available_volume" NUMERIC(5,3),
	PRIMARY KEY("id_pump_fuel")
);




CREATE TABLE IF NOT EXISTS "management_documents" (
	"id_management_document" INTEGER NOT NULL UNIQUE,
	"name" VARCHAR(255) NOT NULL,
	"last_modified" DATE,
	"content" TEXT,
	"status" document_status NOT NULL,
	PRIMARY KEY("id_management_document")
);




CREATE TABLE IF NOT EXISTS "daily_transactions_reports" (
	"id_daily_transaction_report" INTEGER NOT NULL UNIQUE,
	"total_fuel_volume" DECIMAL NOT NULL,
	"total_electricity_volume" DECIMAL NOT NULL,
	"total_product_volume" DECIMAL NOT NULL,
	"transaction_count" INTEGER NOT NULL,
	"annex_transaction_count" INTEGER NOT NULL,
	"total_fuels_amount" DECIMAL NOT NULL,
	"total_electricity_amount" DECIMAL NOT NULL,
	"total_products_amount" DECIMAL NOT NULL,
	"report_date" DATE NOT NULL,
	"total_amount" DECIMAL NOT NULL,
	"status" document_status,
	PRIMARY KEY("id_daily_transaction_report")
);




CREATE TABLE IF NOT EXISTS "incident_reports" (
	"id_incident_report" INTEGER NOT NULL UNIQUE,
	"type" VARCHAR(255),
	"date" DATE,
	"technical_detail" VARCHAR(255),
	"resolution" VARCHAR(255),
	"status" document_status NOT NULL,
	PRIMARY KEY("id_incident_report")
);




CREATE TABLE IF NOT EXISTS "transaction_payments" (
	"id_transaction_payment" INTEGER NOT NULL UNIQUE,
	"id_transaction" INTEGER NOT NULL,
	"payment_method" payment_methods NOT NULL,
	"amount" NUMERIC(5,3) NOT NULL,
	"end_num_card" VARCHAR(4),
	"status" transaction_status NOT NULL,
	"date" DATE NOT NULL,
	"id_cce_card" INTEGER,
	PRIMARY KEY("id_transaction_payment")
);




CREATE TABLE IF NOT EXISTS "items" (
	"id_item" INTEGER NOT NULL UNIQUE,
	"item_type" VARCHAR(255) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id_item")
);




CREATE TABLE IF NOT EXISTS "restocks" (
	"id_restock" INTEGER NOT NULL UNIQUE,
	"quantity" NUMERIC(5,3) NOT NULL,
	"restock_date" DATE NOT NULL,
	"id_item" INTEGER NOT NULL,
	"status" restock_status NOT NULL,
	PRIMARY KEY("id_restock")
);




CREATE TABLE IF NOT EXISTS "regional_guidelines" (
	"id_regional_guideline" INTEGER NOT NULL UNIQUE,
	"object" VARCHAR(255) NOT NULL,
	"content" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id_regional_guideline")
);




CREATE TABLE IF NOT EXISTS "electricity" (
	"id_item" INTEGER NOT NULL UNIQUE GENERATED BY DEFAULT AS IDENTITY,
	"fast_price" NUMERIC(5,3) NOT NULL,
	"normal_price" NUMERIC(5,3) NOT NULL,
	PRIMARY KEY("id_item")
);



ALTER TABLE "transactions_lines"
ADD FOREIGN KEY("id_transaction") REFERENCES "transactions"("id_transaction")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "clients"
ADD FOREIGN KEY("id_cce_card") REFERENCES "cce_cards"("id_cce_card")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "pumps_fuels"
ADD FOREIGN KEY("id_pump") REFERENCES "pumps"("id_pump")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "transaction_payments"
ADD FOREIGN KEY("id_transaction") REFERENCES "transactions"("id_transaction")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "transactions_lines"
ADD FOREIGN KEY("id_item") REFERENCES "items"("id_item")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "restocks"
ADD FOREIGN KEY("id_item") REFERENCES "items"("id_item")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "products"
ADD FOREIGN KEY("id_item") REFERENCES "items"("id_item")
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "fuels"
ADD FOREIGN KEY("id_item") REFERENCES "items"("id_item")
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "pumps_fuels"
ADD FOREIGN KEY("id_fuel") REFERENCES "fuels"("id_item")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "electricity"
ADD FOREIGN KEY("id_item") REFERENCES "items"("id_item")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "transaction_payments"
ADD FOREIGN KEY("id_cce_card") REFERENCES "cce_cards"("id_cce_card")
ON UPDATE NO ACTION ON DELETE NO ACTION;