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

CREATE TYPE "role" AS ENUM (
	'employee',
	'manager'
);


CREATE TYPE schedule AS (
	opening_time TIME,
	closing_time TIME
);

CREATE TABLE IF NOT EXISTS "items" (
	"id_item" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id_item")
);

CREATE TABLE IF NOT EXISTS "transactions" (
	"id_transaction" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"type" VARCHAR(255) NOT NULL,
	"transaction_date" TIMESTAMP,
	"is_from_automat" BOOLEAN NOT NULL,
	"status" transaction_status NOT NULL,
	"id_user" INTEGER,
	PRIMARY KEY("id_transaction")
);

CREATE TABLE IF NOT EXISTS "pumps" (
	"id_pump" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"is_automat" BOOLEAN NOT NULL,
	"status" pump_charger_status NOT NULL,
	"enabled" BOOLEAN NOT NULL DEFAULT true,
	"in_use_at" TIMESTAMP,
	PRIMARY KEY("id_pump")
);

CREATE TABLE IF NOT EXISTS "ev_chargers" (
	"id_ev_charger" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"is_fast" BOOLEAN NOT NULL,
	"status" pump_charger_status NOT NULL,
	PRIMARY KEY("id_ev_charger")
);

CREATE TABLE IF NOT EXISTS "clients" (
	"id_client" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"firstname" VARCHAR(255) NOT NULL,
	"lastname" VARCHAR(255) NOT NULL,
	"mail" VARCHAR(255) NOT NULL,
	"phone_number" VARCHAR(20) NOT NULL,
	PRIMARY KEY("id_client")
);

CREATE TABLE IF NOT EXISTS "users" (
	"id_user" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"username" VARCHAR(255) NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"email" VARCHAR(255) NOT NULL,
	"role" role NOT NULL,
	"uses_dark_mode" BOOLEAN NOT NULL DEFAULT false,
	"tile_layout" TEXT,
	PRIMARY KEY("id_user")
);

ALTER TABLE "transactions"
	ADD CONSTRAINT fk_transactions_user FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS "weekly_schedule" (
	"id_weekly_schedule" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"monday" SCHEDULE,
	"tuesday" SCHEDULE,
	"wednesday" SCHEDULE,
	"thursday" SCHEDULE,
	"friday" SCHEDULE,
	"saturday" SCHEDULE,
	"sunday" SCHEDULE
);

CREATE TABLE IF NOT EXISTS "cce_settings" (
	"id_setting" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"minimum_credit_amount" NUMERIC(10,3) NOT NULL,
	PRIMARY KEY("id_setting")
);

CREATE TABLE IF NOT EXISTS "cce_bonus_tiers" (
	"id_tier" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"min_amount" NUMERIC(10,3) NOT NULL,
	"bonus_amount" NUMERIC(10,3) NOT NULL,
	PRIMARY KEY("id_tier")
);

CREATE TABLE IF NOT EXISTS "management_documents" (
	"id_management_document" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(255) NOT NULL,
	"last_modified" TIMESTAMP,
	"content" TEXT,
	"status" document_status NOT NULL,
	"sent_at" TIMESTAMP,
	PRIMARY KEY("id_management_document")
);

CREATE TABLE IF NOT EXISTS "daily_transactions_reports" (
	"id_daily_transaction_report" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
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
	"id_incident_report" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"type" VARCHAR(255),
	"date" TIMESTAMP,
	"technical_detail" VARCHAR(255),
	"resolution" VARCHAR(255),
	"status" document_status NOT NULL,
	PRIMARY KEY("id_incident_report")
);

CREATE TABLE IF NOT EXISTS "regional_guidelines" (
	"id_regional_guideline" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"object" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
	PRIMARY KEY("id_regional_guideline")
);

CREATE TABLE IF NOT EXISTS "products" (
	"unit_price" NUMERIC(5,3) NOT NULL,
	"stock" INTEGER NOT NULL,
	"alert_threshold" INTEGER,
	"auto_restock_quantity" INTEGER,
	"id_item" INTEGER NOT NULL UNIQUE,
	PRIMARY KEY("id_item"),
	FOREIGN KEY("id_item") REFERENCES "items"("id_item") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "fuels" (
	"price_per_liter" NUMERIC(5,3) NOT NULL,
	"stock" NUMERIC(10,3),
	"alert_threshold" NUMERIC(10,3),
	"auto_restock_quantity" NUMERIC(10,3),
	"id_item" INTEGER NOT NULL UNIQUE,
	PRIMARY KEY("id_item"),
	FOREIGN KEY("id_item") REFERENCES "items"("id_item") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "electricity" (
	"id_item" INTEGER NOT NULL UNIQUE,
	"fast_price" NUMERIC(5,3) NOT NULL,
	"normal_price" NUMERIC(5,3) NOT NULL,
	PRIMARY KEY("id_item"),
	FOREIGN KEY("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "cce_cards" (
	"id_cce_card" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"id_client" INTEGER NOT NULL,
	"balance" NUMERIC(10,3) NOT NULL,
	"created_at" DATE NOT NULL,
	"expires_at" DATE NOT NULL,
	"code" INTEGER NOT NULL,
	"status" cce_status NOT NULL,
	PRIMARY KEY("id_cce_card"),
	FOREIGN KEY("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "transactions_lines" (
	"id_transaction_line" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"quantity" INTEGER NOT NULL,
	"id_transaction" INTEGER NOT NULL,
	"total_amount" NUMERIC(10,3),
	"id_item" INTEGER NOT NULL,
	PRIMARY KEY("id_transaction_line"),
	FOREIGN KEY("id_transaction") REFERENCES "transactions"("id_transaction") ON DELETE NO ACTION,
	FOREIGN KEY("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "pumps_fuels" (
	"id_pump_fuel" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"id_fuel" INTEGER NOT NULL,
	"id_pump" INTEGER NOT NULL,
	"max_volume" NUMERIC(10,3),
	"available_volume" NUMERIC(10,3),
	PRIMARY KEY("id_pump_fuel"),
	FOREIGN KEY("id_pump") REFERENCES "pumps"("id_pump") ON DELETE NO ACTION,
	FOREIGN KEY("id_fuel") REFERENCES "fuels"("id_item") ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "transaction_payments" (
	"id_transaction_payment" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"id_transaction" INTEGER NOT NULL,
	"payment_method" payment_methods NOT NULL,
	"amount" NUMERIC(10,3) NOT NULL,
	"end_num_card" VARCHAR(4),
	"status" transaction_status NOT NULL,
	"date" DATE NOT NULL,
	"id_cce_card" INTEGER,
	PRIMARY KEY("id_transaction_payment"),
	FOREIGN KEY("id_transaction") REFERENCES "transactions"("id_transaction") ON DELETE NO ACTION,
	FOREIGN KEY("id_cce_card") REFERENCES "cce_cards"("id_cce_card") ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "restocks" (
	"id_restock" INTEGER NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
	"quantity" NUMERIC(10,3) NOT NULL,
	"restock_date" DATE NOT NULL,
	"id_item" INTEGER NOT NULL,
	"status" restock_status NOT NULL,
	PRIMARY KEY("id_restock"),
	FOREIGN KEY("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION
);

INSERT INTO "ev_chargers" ("is_fast", "status") VALUES
(true, 'available'),
(true, 'available'),
(true, 'inUse'),
(true, 'inUse'),
(true, 'available'),
(true, 'available'),
(true, 'outOfOrder'),
(true, 'available'),
(false, 'available'),
(false, 'available');


INSERT INTO "users" ("username", "password", "email", "role") VALUES
('gerant1', '$2a$10$2IBaa5RyHYQyz6qNdWfmteVIWJUbFKSq8KOnuUyY89k43tKMTWd8C', 'admin@example.com', 'manager'),
('employe1', '$2a$10$Q4H7dnAln9/nOyQg4hx0e.p8iwMNJAbffD6MVd9VNdtWT2V7E/WgS', 'employe1@example.com', 'employee'),
('employe2', '$2a$10$Q4H7dnAln9/nOyQg4hx0e.p8iwMNJAbffD6MVd9VNdtWT2V7E/WgS', 'employe2@example.com', 'employee');

INSERT INTO "items" ("name") VALUES
('Sans plomb 95'),
('Sans plomb 98'),
('Diesel'),
('Stylo bille BIC'),
('Essuie-glace'),
('Arbre magique'),
('Coca 33 Cl'),
('Snack'),
('Electricité');

INSERT INTO "fuels" ("id_item", "price_per_liter", "stock", "alert_threshold", "auto_restock_quantity") VALUES
(1, 1.750, 1200.000, 500.000, 100.000),
(2, 1.850, 500.000, 200.000, 100.000),
(3, 1.650, 2000.000, 500.000, 100.000);

INSERT INTO "products" ("id_item", "unit_price", "stock", "alert_threshold", "auto_restock_quantity") VALUES
(4, 1.570, 196, 50, 20),
(5, 24.500, 15, 5, 30),
(6, 0.990, 37, 10, 10),
(7, 1.245, 100, 20, 50),
(8, 2.500, 50, 10, 100);

INSERT INTO "electricity" ("id_item", "fast_price", "normal_price") VALUES
(9, 0.550, 0.350);

INSERT INTO "clients" ("firstname", "lastname", "mail", "phone_number") VALUES
('Mathéo', 'CARLI', 'matheo.carli@gmail.com', '06.95.90.41.23'),
('Matthéo', 'POMEL', 'mattheo.pomel@gmail.com', '06.09.25.43.03'),
('Bryan', 'LACHAL', 'bryan.lachal@gmail.com', '06.12.34.56.78'),
('Louis', 'BEDETTI', 'louis.bedetti@gmail.com', '06.98.76.54.32'),
('Quentin', 'BONNAFFOUX', 'quentin.bonnaffoux@gmail.com', '06.52.67.94.73');

INSERT INTO "cce_cards" ("id_client", "balance", "created_at", "expires_at", "code", "status") VALUES
(1, 35.250, '2025-12-11', '2026-12-11', 9999, 'activated'),
(2, 12.640, '2025-12-02', '2026-12-02', 8888, 'deactivated'),
(3, 10.680, '2025-11-01', '2026-11-01', 7777, 'activated'),
(4, 152.660, '2025-10-04', '2026-10-04', 5555, 'deactivated'),
(5, 1000.000, '2025-10-04', '2026-10-04', 4444, 'deactivated');

INSERT INTO "restocks" ("quantity", "restock_date", "id_item", "status") VALUES
(400.000, '2025-12-11', 1, 'pending'),
(300.000, '2025-12-02', 3, 'pending'),
(500.000, '2025-11-21', 2, 'canceled'),
(10.000, '2025-11-21', 2, 'delivered'),
(500.000, '2025-11-21', 2, 'delivered'),
(500, '2025-11-21', 4, 'delivered');

INSERT INTO "pumps" ("is_automat", "status", "enabled") VALUES
(true, 'available', true),
(true, 'inUse', true),
(false, 'available', true),
(false, 'available', true);

INSERT INTO "pumps_fuels" ("id_fuel", "id_pump", "max_volume", "available_volume") VALUES
(1, 1, 5000.000, 1200.000),
(2, 1, 5000.000, 2000.000),
(3, 2, 5000.000, 500.000);

INSERT INTO "transactions" ("type", "transaction_date", "is_from_automat", "status", "id_user") VALUES
('Carburant', '2026-02-18', false, 'accepted', 2),
('Boutique', '2026-02-18', false, 'accepted', 2),
('Mixte', '2026-02-18', false, 'accepted', 2);

INSERT INTO "transactions_lines" ("quantity", "id_transaction", "total_amount", "id_item") VALUES
(42, 1, 61.410, 3),
(2, 2, 2.490, 7),
(35, 3, 56.200, 1),
(1, 3, 2.500, 8);

INSERT INTO "transaction_payments" ("id_transaction", "payment_method", "amount", "end_num_card", "status", "date", "id_cce_card") VALUES
(1, 'CCE', 61.410, '9999', 'accepted', '2026-02-18', 1),
(2, 'CreditCard', 2.490, '1234', 'accepted', '2026-02-18', NULL),
(3, 'Cash', 58.700, NULL, 'accepted', '2026-02-18', NULL);

INSERT INTO "regional_guidelines" ("object", "content") VALUES
('Procédure nettoyage', 'Nettoyage des pistes tous les mardis matin.'),
('Sécurité incendie', 'Vérification mensuelle des extincteurs.'),
('Salut la team', 'aledLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed ex nec mauris porta mollis vel non sem. Vestibulum non condimentum neque, a imperdiet est. Vivamus iaculis sodales nunc, quis bibendum dolor pellentesque quis. Aenean sem metus, cursus quis placerat nec, dictum id orci. Aliquam quis est a lacus facilisis venenatis. Curabitur nec lorem eu urna tempus porta vel ac risus. Aenean eget sodales ligula, ut tincidunt justo. Fusce maximus condimentum nisi eu tempor. Praesent rutrum non justo in dignissim. Aliquam id lectus quis nulla scelerisque pellentesque condimentum sit amet urna. Donec pellentesque, ex quis tempus finibus, lorem odio consectetur quam, sed commodo ante lorem et orci. Vestibulum id ipsum ac orci laoreet egestas. In blandit sit amet nibh vitae egestas. In hac habitasse platea dictumst. Proin eu pharetra dolor. Nam eget facilisis sapien. Donec consequat dolor ac purus volutpat, eu hendrerit elit tempus. Nam varius, nunc a vulputate dignissim, metus ex rhoncus lorem, ut consectetur mi orci ut urna. Maecenas maximus venenatis faucibus. Sed malesuada eleifend dictum.');

INSERT INTO "incident_reports" ("type", "date", "technical_detail", "resolution", "status") VALUES
('Panne pompe', '2026-02-10', 'Erreur TPE sur pompe 2', 'Redémarrage du système', 'locked');

INSERT INTO "cce_settings" ("minimum_credit_amount") VALUES (15.000);

SELECT setval(pg_get_serial_sequence('cce_cards', 'id_cce_card'), (SELECT MAX(id_cce_card) FROM cce_cards));
SELECT setval(pg_get_serial_sequence('clients', 'id_client'), (SELECT MAX(id_client) FROM clients));

INSERT INTO "daily_transactions_reports" (
    "total_fuel_volume",
    "total_electricity_volume",
    "total_product_volume",
    "transaction_count",
    "annex_transaction_count",
    "total_fuels_amount",
    "total_electricity_amount",
    "total_products_amount",
    "report_date",
    "total_amount",
    "status"
) VALUES(
    550.000,   -- total_fuel_volume (L)
    900.000,   -- total_electricity_volume (kWh)
    71.000,    -- total_product_volume (unités)
    60,        -- transaction_count
    47,        -- annex_transaction_count (automates)
    944.500,   -- total_fuels_amount
    180.000,   -- total_electricity_amount
    150.000,   -- total_products_amount
    '2026-02-18',
    1274.500,  -- total_amount
    'locked'
),
(
    420.000,
    650.000,
    45.000,
    45,
    30,
    693.000,
    130.000,
    145.420,
    '2026-02-17',
    968.420,
    'locked'
),
(
    310.000,
    200.000,
    28.000,
    32,
    20,
    511.500,
    40.000,
    62.500,
    '2026-02-16',
    614.000,
    'pending'
),
(
    480.000,
    750.000,
    60.000,
    52,
    38,
    792.000,
    150.000,
    120.000,
    '2026-02-15',
    1062.000,
    'locked'
);