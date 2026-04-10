package jwd.przepisnik.web.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BaseResponse<T>(
        @JsonProperty("success") boolean isSuccess,
        List<String> errorMessages,
        T data) {

    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(
                true,
                List.of(),
                data);
    }

    public static <T> BaseResponse<T> failure(String... errorMessages) {
        return new BaseResponse<>(
                false,
                List.of(errorMessages),
                null);
    }
}
