DROP TABLE IF EXISTS carburant CASCADE;

CREATE TABLE carburant (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prix_litre DECIMAL(5, 2) NOT NULL
);

INSERT INTO carburant (nom, prix_litre) VALUES 
('SP95', 1.85),
('Gazole', 1.70);
