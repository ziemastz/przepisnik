package jwd.przepisnik.controller;

import java.security.Principal;
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

import jwd.przepisnik.constants.ApiPaths;
import jwd.przepisnik.constants.AppMessages;
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
@RequestMapping(ApiPaths.Users.BASE)
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(ApiPaths.Users.CREATE)
    public ResponseEntity<BaseResponse<CreateUserResponse>> createUser(
            @Valid @RequestBody BaseRequest<CreateUserRequest> userRequest) {
        if (userRequest == null || userRequest.data() == null) {
            return ResponseEntity.badRequest()
                    .body(BaseResponse.failure(AppMessages.Controller.MISSING_USER_DATA));
        }

        CreateUserRequest userData = userRequest.data();

        UserDto userDto = new UserDto(
                userData.username(),
                userData.password(),
                userData.email(),
                userData.name(),
                userData.surname(),
                userData.role());

        User created = userService.createUser(userDto);

        return ResponseEntity.ok(BaseResponse.success(new CreateUserResponse(created.getId())));
    }

    @PostMapping(ApiPaths.Users.UPDATE_BY_ID)
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody UserDto userDto) {
        Optional<User> updated = userService.updateUser(id, userDto);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(ApiPaths.Users.DELETE_BY_ID)
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(ApiPaths.Users.BY_ID)
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
                        .body(BaseResponse.failure(AppMessages.Controller.USER_BY_ID_NOT_FOUND)));
    }

    @GetMapping(ApiPaths.Users.ME)
    public ResponseEntity<BaseResponse<UserResponse>> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        return userService.getUserByUsername(principal.getName())
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
                    .body(BaseResponse.failure(AppMessages.Controller.CURRENT_USER_NOT_FOUND)));
    }
}
