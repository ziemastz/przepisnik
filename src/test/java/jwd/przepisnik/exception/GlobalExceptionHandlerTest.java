package jwd.przepisnik.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.web.response.BaseResponse;

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

    @Test
    void shouldHandleMethodArgumentNotValidException() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(
                java.util.List.of(new FieldError("request", "data.name", "nie moze byc puste")));

        ResponseEntity<BaseResponse<Object>> response = handler.handleMethodArgumentNotValidException(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody()).usingRecursiveComparison().isEqualTo(
                new BaseResponse<>(false, java.util.List.of("data.name" + AppMessages.FIELD_ERROR_SEPARATOR + "nie moze byc puste"), null));
    }

    @Test
    void shouldHandleHttpMessageNotReadableException() {
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("invalid");

        ResponseEntity<BaseResponse<Object>> response = handler.handleHttpMessageNotReadableException(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody())
                .usingRecursiveComparison()
                .isEqualTo(BaseResponse.failure(AppMessages.INVALID_REQUEST_PAYLOAD));
    }

    @Test
    void shouldHandleRuntimeException() {
        RuntimeException ex = new RuntimeException("Blad wykonania");

        ResponseEntity<BaseResponse<Object>> response = handler.handleRuntimeException(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody())
                .usingRecursiveComparison()
                .isEqualTo(BaseResponse.failure("Blad wykonania"));
    }
}
