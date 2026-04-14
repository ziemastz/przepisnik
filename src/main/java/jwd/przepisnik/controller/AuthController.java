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

import jwd.przepisnik.constants.ApiPaths;
import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.security.JwtTokenProvider;
import jwd.przepisnik.web.request.BaseRequest;
import jwd.przepisnik.web.request.LoginRequest;
import jwd.przepisnik.web.response.BaseResponse;
import jwd.przepisnik.web.response.LoginResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping(ApiPaths.Auth.BASE)
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping(ApiPaths.Auth.LOGIN)
    public ResponseEntity<BaseResponse<LoginResponse>> login(
            @Valid @RequestBody BaseRequest<LoginRequest> loginRequest) {
        if (loginRequest == null || loginRequest.data() == null) {
            return ResponseEntity.badRequest()
                    .body(BaseResponse.failure(AppMessages.Controller.MISSING_LOGIN_DATA));
        }

        LoginRequest credentials = loginRequest.data();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.username(), credentials.password()));
            UserDetails principal = (UserDetails) authentication.getPrincipal();
            String token = tokenProvider.generateToken(principal);
            return ResponseEntity.ok(BaseResponse.success(new LoginResponse(token)));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure(AppMessages.Controller.INVALID_USERNAME_OR_PASSWORD));
        }
    }
}
