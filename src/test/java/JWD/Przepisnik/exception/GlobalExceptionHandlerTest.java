package JWD.Przepisnik.exception;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import JWD.Przepisnik.web.response.BaseResponse;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void shouldHandleUserAlreadyExistsException() {
        UserAlreadyExistsException ex = new UserAlreadyExistsException("Uzytkownik istnieje");

        ResponseEntity<BaseResponse<Object>> response = handler.handleUserAlreadyExistsException(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody())
                .usingRecursiveComparison()
                .isEqualTo(BaseResponse.failure("Uzytkownik istnieje"));
    }

    @Test
    void shouldHandleIllegalArgumentException() {
        IllegalArgumentException ex = new IllegalArgumentException("Blad danych");

        ResponseEntity<BaseResponse<Object>> response = handler.handleIllegalArgumentException(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody())
                .usingRecursiveComparison()
                .isEqualTo(BaseResponse.failure("Blad danych"));
    }
}
