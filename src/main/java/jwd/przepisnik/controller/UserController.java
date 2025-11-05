package jwd.przepisnik.controller;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jwd.przepisnik.service.UserService;
import jwd.przepisnik.web.dto.UserDto;
import jwd.przepisnik.web.request.BaseRequest;
import jwd.przepisnik.web.request.CreateUserRequest;
import jwd.przepisnik.web.response.BaseResponse;
import jwd.przepisnik.web.response.CreateUserResponse;
import jwd.przepisnik.web.response.UserResponse;
import jwd.przepisnik.models.User;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<BaseResponse<CreateUserResponse>> createUser(
            @Valid @RequestBody BaseRequest<CreateUserRequest> userRequest) {
        if (userRequest == null || userRequest.getData() == null) {
            return ResponseEntity.badRequest()
                    .body(BaseResponse.failure("Missing user data."));
        }

        CreateUserRequest userData = userRequest.getData();

        UserDto userDto = new UserDto(
                userData.getUsername(),
                userData.getPassword(),
                userData.getEmail(),
                userData.getName(),
                userData.getSurname(),
                userData.getRole());

        User created = userService.createUser(userDto);

        return ResponseEntity.ok(BaseResponse.success(new CreateUserResponse(created.getId())));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody UserDto userDto) {
        Optional<User> updated = userService.updateUser(id, userDto);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id)
                .map(user -> {
                    UserResponse userResponse = new UserResponse(
                            user.getUsername(),
                            user.getEmail(),
                            user.getName(),
                            user.getSurname(),
                            user.getRole());
                    return ResponseEntity.ok(BaseResponse.success(userResponse));
                })
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(BaseResponse.failure("Uzytkownik o podanym ID nie zostal znaleziony.")));
    }
}
