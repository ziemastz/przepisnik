package JWD.Przepisnik.web.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
public class BaseResponse<T> {
    boolean isSuccess;
    List<String> errorMessages;
    T data;

    public static <T> BaseResponse<T> success(T data) {
        BaseResponse<T> response = new BaseResponse<>(
                true,
                List.of(),
                data);

        return response;
    }

    public static <T> BaseResponse<T> failure(String... errorMessages) {
        BaseResponse<T> response = new BaseResponse<>(
                false,
                List.of(errorMessages),
                null);

        return response;
    }
}
