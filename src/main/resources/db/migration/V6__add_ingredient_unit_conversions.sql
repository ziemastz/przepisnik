CREATE TABLE ingredient_unit_conversions (
    unit VARCHAR(255) PRIMARY KEY,
    grams_per_unit NUMERIC(10, 2) NOT NULL
);

INSERT INTO ingredient_unit_conversions (unit, grams_per_unit) VALUES
    ('GRAM', 1.00),
    ('TEASPOON', 5.00),
    ('TABLESPOON', 15.00),
    ('CUP', 250.00),
    ('ML', 1.00),
    ('L', 1000.00),
    ('KG', 1000.00),
    ('PINCH', 0.50);
