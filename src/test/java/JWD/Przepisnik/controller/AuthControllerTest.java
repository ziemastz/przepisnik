package jwd.przepisnik.controller;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import jwd.przepisnik.security.JwtTokenProvider;
import jwd.przepisnik.web.request.BaseRequest;
import jwd.przepisnik.web.request.LoginRequest;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider jwtTokenProvider;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new AuthController(authenticationManager, jwtTokenProvider)).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldAuthenticateAndReturnToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.username = "john";
        loginRequest.password = "secret";

        UserDetails principal = User.withUsername("john").password("encoded").authorities("ROLE_USER").build();
        Authentication authResult = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authResult);
        when(jwtTokenProvider.generateToken(principal)).thenReturn("jwt-token");

        BaseRequest<LoginRequest> requestBody = new BaseRequest<>(loginRequest);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", equalTo("jwt-token")))
                .andExpect(jsonPath("$.data.type", equalTo("Bearer")));
    }

    @Test
    void shouldReturnBadRequestWhenNoData() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldReturnUnauthorizedOnBadCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.username = "john";
        loginRequest.password = "wrong";

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("invalid"));

        BaseRequest<LoginRequest> requestBody = new BaseRequest<>(loginRequest);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.errorMessages[0]", equalTo("Invalid username or password.")));
    }
}
