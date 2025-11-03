package jwd.przepisnik.web.request;

import jakarta.validation.Valid;
import lombok.Value;

@Value
public class BaseRequest<T> {
    @Valid
    T data;
}
