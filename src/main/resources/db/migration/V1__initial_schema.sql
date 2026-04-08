CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255),
    password_hash VARCHAR(255),
    email VARCHAR(255),
    name VARCHAR(255),
    surname VARCHAR(255),
    role VARCHAR(255),
    CONSTRAINT uk_users_username_email UNIQUE (username, email)
);

CREATE TABLE ingredients (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    CONSTRAINT uk_ingredients_normalized_name UNIQUE (normalized_name)
);

CREATE TABLE recipes (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    preparation_time_minutes INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    author_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_recipes_author FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY,
    recipe_id UUID NOT NULL,
    ingredient_id UUID NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    CONSTRAINT fk_recipe_ingredients_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    CONSTRAINT fk_recipe_ingredients_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
    CONSTRAINT uk_recipe_ingredients_recipe_ingredient UNIQUE (recipe_id, ingredient_id)
);
