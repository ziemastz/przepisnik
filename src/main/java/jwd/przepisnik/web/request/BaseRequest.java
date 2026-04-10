package jwd.przepisnik.web.request;

import jakarta.validation.Valid;

public record BaseRequest<T>(@Valid T data) {
}
