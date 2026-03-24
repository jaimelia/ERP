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
	"stock" NUMERIC(10,3),
	"alert_threshold" NUMERIC(10,3) NOT NULL,
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
	"uses_dark_mode" BOOLEAN NOT NULL DEFAULT false,
	"tile_layout" TEXT,
	PRIMARY KEY("id_user")
);




CREATE TABLE IF NOT EXISTS "weekly_schedule" (
	"id_weekly_schedule" INTEGER NOT NULL UNIQUE,
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
	"balance" NUMERIC(10,3) NOT NULL,
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
	"total_amount" NUMERIC(10,3),
	"id_item" INTEGER NOT NULL,
	PRIMARY KEY("id_transaction_line")
);




CREATE TABLE IF NOT EXISTS "pumps_fuels" (
	"id_pump_fuel" INTEGER NOT NULL UNIQUE,
	"id_fuel" INTEGER NOT NULL,
	"id_pump" INTEGER NOT NULL,
	"max_volume" NUMERIC(10,3),
	"available_volume" NUMERIC(10,3),
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
	"amount" NUMERIC(10,3) NOT NULL,
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
	"quantity" NUMERIC(10,3) NOT NULL,
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

INSERT INTO "ev_chargers" ("id_ev_charger", "is_fast", "status") VALUES
(1, true, 'available'),
(2, true, 'available'),
(3, true, 'inUse'),
(4, true, 'inUse'),
(5, true, 'available'),
(6, true, 'available'),
(7, true, 'outOfOrder'),
(8, true, 'available'),
(9, false, 'available'),
(10, false, 'available');

INSERT INTO "users" ("id_user", "username", "password", "email", "role") VALUES
(1, 'gerant1', '$2a$10$2IBaa5RyHYQyz6qNdWfmteVIWJUbFKSq8KOnuUyY89k43tKMTWd8C', 'admin@example.com', 'gerant'),
(2, 'employe1', '$2a$10$Q4H7dnAln9/nOyQg4hx0e.p8iwMNJAbffD6MVd9VNdtWT2V7E/WgS', 'employe1@example.com', 'employe'),
(3, 'employe2', '$2a$10$Q4H7dnAln9/nOyQg4hx0e.p8iwMNJAbffD6MVd9VNdtWT2V7E/WgS', 'employe2@example.com', 'employe');

INSERT INTO "items" ("id_item", "item_type", "name") VALUES
(7, 'fuel', 'Sans plomb 95'),
(8, 'fuel', 'Sans plomb 98'),
(9, 'fuel', 'Diesel'),
(10, 'product', 'Stylo bille BIC'),
(11, 'product', 'Essuie-glace'),
(12, 'product', 'Arbre magique'),
(13, 'product', 'Coca 33 Cl'),
(14, 'product', 'Snack'),
(15, 'electricity', 'Electricité');

INSERT INTO "fuels" ("id_item", "price_per_liter", "stock", "alert_threshold") VALUES
(7, 1.750, 1200.000, 500.000),
(8, 1.850, 500.000, 200.000),
(9, 1.650, 2000.000, 500.000);

INSERT INTO "products" ("id_item", "unit_price", "stock", "alert_threshold") VALUES
(10, 1.570, 196, 50),
(11, 24.500, 15, 5),
(12, 0.990, 37, 10),
(13, 1.245, 100, 20),
(14, 2.500, 50, 10);

INSERT INTO "electricity" ("id_item", "fast_price", "normal_price") VALUES
(15, 0.550, 0.350);

INSERT INTO "cce_cards" ("id_cce_card", "balance", "created_at", "expires_at", "code", "minimum_credit_amount", "status") VALUES
(1, 35.250, '2025-12-11', '2026-12-11', 9999, 10, 'activated'),
(2, 12.640, '2025-12-02', '2026-12-02', 8888, 10, 'deactivated'),
(3, 10.680, '2025-11-01', '2026-11-01', 7777, 10, 'activated'),
(4, 152.660, '2025-10-04', '2026-10-04', 5555, 10, 'deactivated');

INSERT INTO "clients" ("id_client", "firstname", "lastname", "mail", "phone_number", "id_cce_card") VALUES
(1, 'Mathéo', 'CARLI', 'matheo.carli@gmail.com', '06.95.90.41.23', 1),
(2, 'Matthéo', 'POMEL', 'mattheo.pomel@gmail.com', '06.09.25.43.03', 2),
(3, 'Bryan', 'LACHAL', 'bryan.lachal@gmail.com', '06.12.34.56.78', 3),
(4, 'Louis', 'BEDETTI', 'louis.bedetti@gmail.com', '06.98.76.54.32', 4);

INSERT INTO "restocks" ("id_restock", "quantity", "restock_date", "id_item", "status") VALUES
(1, 400.000, '2025-12-11', 7, 'pending'),
(2, 300.000, '2025-12-02', 9, 'pending'),
(3, 500.000, '2025-11-21', 8, 'pending'),
(4, 10.000, '2025-11-21', 8, 'delivered'),
(5, 500.000, '2025-11-21', 8, 'delivered'),
(6, 500.000, '2025-11-21', 8, 'delivered');

INSERT INTO "pumps" ("id_pump", "is_automat", "status") VALUES
(1, false, 'available'),
(2, true, 'inUse'),
(3, false, 'available');

INSERT INTO "pumps_fuels" ("id_pump_fuel", "id_fuel", "id_pump", "max_volume", "available_volume") VALUES
(1, 7, 1, 5000.000, 1200.000),
(2, 9, 1, 5000.000, 2000.000),
(3, 8, 2, 5000.000, 500.000);

INSERT INTO "transactions" ("id_transaction", "type", "transaction_date", "is_from_automat", "status") VALUES
(145, 'Carburant', '2026-02-18', false, 'accepted'),
(146, 'Boutique', '2026-02-18', false, 'accepted'),
(147, 'Mixte', '2026-02-18', false, 'accepted');

INSERT INTO "transactions_lines" ("id_transaction_line", "quantity", "id_transaction", "total_amount", "id_item") VALUES
(1, 42, 145, 61.410, 9),
(2, 2, 146, 2.490, 13),
(3, 35, 147, 56.200, 7),
(4, 1, 147, 2.500, 14);

INSERT INTO "transaction_payments" ("id_transaction_payment", "id_transaction", "payment_method", "amount", "end_num_card", "status", "date", "id_cce_card") VALUES
(1, 145, 'CCE', 61.410, '9999', 'accepted', '2026-02-18', 1),
(2, 146, 'CreditCard', 2.490, '1234', 'accepted', '2026-02-18', NULL),
(3, 147, 'Cash', 58.700, NULL, 'accepted', '2026-02-18', NULL);


INSERT INTO "regional_guidelines" ("id_regional_guideline", "object", "content") VALUES
(1, 'Procédure nettoyage', 'Nettoyage des pistes tous les mardis matin.'),
(2, 'Sécurité incendie', 'Vérification mensuelle des extincteurs.');

INSERT INTO "incident_reports" ("id_incident_report", "type", "date", "technical_detail", "resolution", "status") VALUES
(1, 'Panne pompe', '2026-02-10', 'Erreur TPE sur pompe 2', 'Redémarrage du système', 'locked');