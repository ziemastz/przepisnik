package jwd.przepisnik.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.IngredientUnitConversion;
import jwd.przepisnik.repository.IngredientUnitConversionRepository;

@ExtendWith(MockitoExtension.class)
class IngredientUnitConversionServiceTest {

    @Mock
    private IngredientUnitConversionRepository ingredientUnitConversionRepository;

    @InjectMocks
    private IngredientUnitConversionService ingredientUnitConversionService;

    @Test
    void shouldConvertQuantityToGramsUsingConfiguredFactor() {
        IngredientUnitConversion conversion = new IngredientUnitConversion();
        conversion.setUnit(IngredientUnit.TABLESPOON);
        conversion.setGramsPerUnit(new BigDecimal("15.00"));

        when(ingredientUnitConversionRepository.findById(IngredientUnit.TABLESPOON))
                .thenReturn(Optional.of(conversion));

        BigDecimal result = ingredientUnitConversionService.convertToGrams(new BigDecimal("2.00"),
                IngredientUnit.TABLESPOON);

        assertThat(result).isEqualByComparingTo(new BigDecimal("30.0000"));
    }

    @Test
    void shouldThrowWhenConversionIsMissingForUnit() {
        when(ingredientUnitConversionRepository.findById(IngredientUnit.ML))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ingredientUnitConversionService.convertToGrams(new BigDecimal("2.00"), IngredientUnit.ML));

        assertThat(exception.getMessage())
                .isEqualTo(String.format(AppMessages.Service.INGREDIENT_UNIT_CONVERSION_MISSING_PATTERN,
                        IngredientUnit.ML));
    }

    @Test
    void shouldConvertPieceUsingIngredientPortion() {
        BigDecimal result = ingredientUnitConversionService.convertToGrams(
                new BigDecimal("3.00"),
                IngredientUnit.PIECE,
                new BigDecimal("80.00"));

        assertThat(result).isEqualByComparingTo(new BigDecimal("240.0000"));
    }

    @Test
    void shouldThrowWhenPieceConversionMissingPortion() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ingredientUnitConversionService.convertToGrams(
                        new BigDecimal("2.00"),
                        IngredientUnit.PIECE,
                        null));

        assertThat(exception.getMessage())
                .isEqualTo(AppMessages.Service.INGREDIENT_PORTION_REQUIRED_FOR_PIECE);
    }
}
