package JWD.Przepisnik.controller;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import JWD.Przepisnik.models.User;
import JWD.Przepisnik.service.UserService;
import JWD.Przepisnik.web.dto.UserDto;
import JWD.Przepisnik.web.request.BaseRequest;
import JWD.Przepisnik.web.request.CreateUserRequest;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new UserController(userService)).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldCreateUser() throws Exception {
        CreateUserRequest createRequest = new CreateUserRequest();
        createRequest.username = "john";
        createRequest.password = "secret";
        createRequest.email = "john@example.com";
        createRequest.name = "John";
        createRequest.surname = "Doe";
        createRequest.role = "USER";

        UUID userId = UUID.randomUUID();
        User created = new User();
        created.setId(userId);
        when(userService.createUser(any(UserDto.class))).thenReturn(created);

        BaseRequest<CreateUserRequest> requestBody = new BaseRequest<>(createRequest);

        mockMvc.perform(post("/api/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", equalTo(userId.toString())));
    }

    @Test
    void shouldReturnBadRequestWhenCreatePayloadMissing() throws Exception {
        mockMvc.perform(post("/api/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldReturnUserById() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setUsername("john");
        user.setEmail("john@example.com");
        user.setName("John");
        user.setSurname("Doe");
        user.setRole("USER");
        when(userService.getUserById(userId)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", equalTo("john")));
    }

    @Test
    void shouldReturnNotFoundWhenUserMissing() throws Exception {
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldUpdateUser() throws Exception {
        UUID userId = UUID.randomUUID();
        UserDto dto = new UserDto("john", null, "john@example.com", "John", "Doe", "USER");
        User updated = new User();
        updated.setUsername("john");
        when(userService.updateUser(eq(userId), any(UserDto.class))).thenReturn(Optional.of(updated));

        mockMvc.perform(post("/api/users/update/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", equalTo("john")));
    }

    @Test
    void shouldReturnNotFoundOnUpdateWhenUserMissing() throws Exception {
        UUID userId = UUID.randomUUID();
        UserDto dto = new UserDto("john", null, "john@example.com", "John", "Doe", "USER");
        when(userService.updateUser(eq(userId), any(UserDto.class))).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/users/update/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteUser() throws Exception {
        UUID userId = UUID.randomUUID();
        doNothing().when(userService).deleteUser(userId);

        mockMvc.perform(post("/api/users/delete/{id}", userId))
                .andExpect(status().isNoContent());
    }
}
