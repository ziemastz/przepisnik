package jwd.przepisnik.models;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import org.junit.jupiter.api.Test;

class IngredientUnitTest {

    @Test
    void shouldContainAllSupportedUnits() {
        assertArrayEquals(new IngredientUnit[] {
                IngredientUnit.GRAM,
                IngredientUnit.PIECE,
                IngredientUnit.TEASPOON,
                IngredientUnit.TABLESPOON,
                IngredientUnit.CUP,
                IngredientUnit.ML,
                IngredientUnit.L,
                IngredientUnit.KG
        }, IngredientUnit.values());
    }
}
