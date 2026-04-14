package jwd.przepisnik.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import jwd.przepisnik.constants.ApiPaths;
import jwd.przepisnik.security.JwtAuthenticationEntryPoint;
import jwd.przepisnik.security.JwtAuthenticationFilter;

@Configuration
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {
    private static final String[] PUBLIC_RESOURCES = {
            ApiPaths.HOME,
            ApiPaths.INDEX_HTML,
            ApiPaths.MANIFEST_JSON,
            ApiPaths.ASSET_MANIFEST_JSON,
            ApiPaths.ROBOTS_TXT,
            ApiPaths.STATIC_ALL,
            ApiPaths.FAVICON_ICO
    };

        private static final String AUTH_ENDPOINT = ApiPaths.Auth.ALL;
        private static final String H2_CONSOLE_ENDPOINT = ApiPaths.H2_CONSOLE_ALL;
        private static final String USER_REGISTRATION_ENDPOINT = ApiPaths.Users.CREATE_FULL;
        private static final RequestMatcher API_REQUESTS = PathPatternRequestMatcher.withDefaults().matcher(ApiPaths.API_ALL);
    private static final RequestMatcher H2_CONSOLE_REQUESTS = PathPatternRequestMatcher.withDefaults()
            .matcher(H2_CONSOLE_ENDPOINT);
    private static final RequestMatcher CSRF_PROTECTION_MATCHER = request ->
            CsrfFilter.DEFAULT_CSRF_MATCHER.matches(request)
                    && !API_REQUESTS.matches(request)
                    && !H2_CONSOLE_REQUESTS.matches(request);

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint authenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.requireCsrfProtectionMatcher(CSRF_PROTECTION_MATCHER))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint))
                .authorizeHttpRequests(this::configureAuthorization)
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private void configureAuthorization(
            AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
        auth.requestMatchers(PUBLIC_RESOURCES).permitAll();
        auth.requestMatchers(H2_CONSOLE_ENDPOINT).permitAll();
        auth.requestMatchers(AUTH_ENDPOINT).permitAll();
        auth.requestMatchers(HttpMethod.POST, USER_REGISTRATION_ENDPOINT).permitAll();
        auth.requestMatchers(API_REQUESTS).authenticated();
        auth.anyRequest().permitAll();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
