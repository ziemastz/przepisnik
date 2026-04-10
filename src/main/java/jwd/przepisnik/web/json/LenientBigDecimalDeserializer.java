package jwd.przepisnik.web.json;

import java.io.IOException;
import java.math.BigDecimal;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

public class LenientBigDecimalDeserializer extends JsonDeserializer<BigDecimal> {

    @Override
    public BigDecimal deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        if (parser.currentToken() == JsonToken.VALUE_NUMBER_INT || parser.currentToken() == JsonToken.VALUE_NUMBER_FLOAT) {
            return parser.getDecimalValue();
        }

        String rawValue = parser.getValueAsString();
        if (rawValue == null) {
            return null;
        }

        String normalized = rawValue.trim().replace(',', '.');
        if (normalized.isEmpty()) {
            return null;
        }

        try {
            return new BigDecimal(normalized);
        } catch (NumberFormatException ex) {
            throw InvalidFormatException.from(
                    parser,
                    "Invalid decimal number format. Use e.g. 0.5 or 0,5.",
                    rawValue,
                    BigDecimal.class);
        }
    }
}
