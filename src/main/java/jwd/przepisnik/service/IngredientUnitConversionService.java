package jwd.przepisnik.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.repository.IngredientUnitConversionRepository;

@Service
public class IngredientUnitConversionService {
    private final IngredientUnitConversionRepository ingredientUnitConversionRepository;

    public IngredientUnitConversionService(IngredientUnitConversionRepository ingredientUnitConversionRepository) {
        this.ingredientUnitConversionRepository = ingredientUnitConversionRepository;
    }

    @Transactional(readOnly = true)
    public BigDecimal convertToGrams(BigDecimal quantity, IngredientUnit unit) {
        return convertToGrams(quantity, unit, null);
    }

    @Transactional(readOnly = true)
    public BigDecimal convertToGrams(BigDecimal quantity, IngredientUnit unit, BigDecimal portion) {
        if (quantity == null) {
            throw new IllegalArgumentException(AppMessages.Service.INGREDIENT_QUANTITY_REQUIRED);
        }

        if (unit == null) {
            throw new IllegalArgumentException(AppMessages.Service.INGREDIENT_UNIT_REQUIRED);
        }

        if (unit == IngredientUnit.PIECE) {
            if (portion == null) {
                throw new IllegalArgumentException(AppMessages.Service.INGREDIENT_PORTION_REQUIRED_FOR_PIECE);
            }
            BigDecimal gramsPerUnit = portion;
            return quantity.multiply(gramsPerUnit);
        }

        BigDecimal gramsPerUnit = ingredientUnitConversionRepository.findById(unit)
                .map(conversion -> conversion.getGramsPerUnit())
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format(AppMessages.Service.INGREDIENT_UNIT_CONVERSION_MISSING_PATTERN, unit)));

        return quantity.multiply(gramsPerUnit);
    }
}
