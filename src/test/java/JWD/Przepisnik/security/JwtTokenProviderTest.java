package jwd.przepisnik.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jwd.przepisnik.config.JwtProperties;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("przepisnik-test-secret-key-which-is-long-enough");
        properties.setExpirationSeconds(60);
        properties.setIssuer("Przepisnik");

        jwtTokenProvider = new JwtTokenProvider(properties);
    }

    @Test
    void shouldGenerateAndValidateToken() {
        UserDetails userDetails = User.withUsername("john")
                .password("ignored")
                .authorities("ROLE_USER")
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);

        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        assertThat(jwtTokenProvider.getUsername(token)).isEqualTo("john");
    }

    @Test
    void shouldInvalidateTamperedToken() {
        UserDetails userDetails = User.withUsername("john")
                .password("ignored")
                .authorities("ROLE_USER")
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);
        String tampered = token + "tamper";

        assertThat(jwtTokenProvider.validateToken(tampered)).isFalse();
        assertThatThrownBy(() -> jwtTokenProvider.getUsername(tampered)).isInstanceOf(RuntimeException.class);
    }

    @Test
    void shouldFallbackToUtf8SecretIfNotBase64() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("plain-text-secret-which-is-long-enough");
        properties.setExpirationSeconds(60);
        properties.setIssuer("Przepisnik");

        JwtTokenProvider provider = new JwtTokenProvider(properties);

        UserDetails userDetails = User.withUsername("anna")
                .password("ignored")
                .authorities("ROLE_USER")
                .build();

        String token = provider.generateToken(userDetails);

        assertThat(provider.validateToken(token)).isTrue();
        assertThat(provider.getUsername(token)).isEqualTo("anna");
    }
}
