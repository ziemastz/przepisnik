package JWD.Przepisnik.controller;

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

import JWD.Przepisnik.security.JwtTokenProvider;
import JWD.Przepisnik.web.request.BaseRequest;
import JWD.Przepisnik.web.request.LoginRequest;
import JWD.Przepisnik.web.response.BaseResponse;
import JWD.Przepisnik.web.response.LoginResponse;
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
                    new UsernamePasswordAuthenticationToken(credentials.username, credentials.password));
            UserDetails principal = (UserDetails) authentication.getPrincipal();
            String token = tokenProvider.generateToken(principal);
            return ResponseEntity.ok(BaseResponse.success(new LoginResponse(token)));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Invalid username or password."));
        }
    }
}
