-- Migration : insertion de 4 rapports journaliers de test
-- À exécuter une seule fois sur la base existante.

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
) VALUES
(
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
