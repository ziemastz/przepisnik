package jwd.przepisnik.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jwd.przepisnik.security.JwtTokenProvider;
import jwd.przepisnik.web.request.BaseRequest;
import jwd.przepisnik.web.request.LoginRequest;
import jwd.przepisnik.web.response.BaseResponse;
import jwd.przepisnik.web.response.LoginResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(
            @Valid @RequestBody BaseRequest<LoginRequest> loginRequest) {
        if (loginRequest == null || loginRequest.getData() == null) {
            return ResponseEntity.badRequest()
                    .body(BaseResponse.failure("Missing login data."));
        }

        LoginRequest credentials = loginRequest.getData();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.getUsername(), credentials.getPassword()));
            UserDetails principal = (UserDetails) authentication.getPrincipal();
            String token = tokenProvider.generateToken(principal);
            return ResponseEntity.ok(BaseResponse.success(new LoginResponse(token)));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Invalid username or password."));
        }
    }
}
