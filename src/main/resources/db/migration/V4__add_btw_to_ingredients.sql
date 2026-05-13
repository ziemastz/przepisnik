-- Add nutritional values (BTW - Białko/Protein, Tłuszcz/Fat, Węglowodany/Carbohydrates) to ingredients
-- All columns are nullable as not all ingredients may have nutritional data

ALTER TABLE ingredients
ADD COLUMN protein DECIMAL(10, 2);

ALTER TABLE ingredients
ADD COLUMN fat DECIMAL(10, 2);

ALTER TABLE ingredients
ADD COLUMN carbohydrates DECIMAL(10, 2);
