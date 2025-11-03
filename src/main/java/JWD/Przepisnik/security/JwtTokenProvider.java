package jwd.przepisnik.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import java.security.Key;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import jwd.przepisnik.config.JwtProperties;

@Component
public class JwtTokenProvider {
    private final JwtProperties properties;
    private final Key signingKey;

    public JwtTokenProvider(JwtProperties properties) {
        this.properties = properties;
        this.signingKey = Keys.hmacShaKeyFor(resolveSecret(properties.getSecret()));
    }

    public String generateToken(UserDetails userDetails) {
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(properties.getExpirationSeconds());

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .issuer(properties.getIssuer())
                .signWith(signingKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public String getUsername(String token) {
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private byte[] resolveSecret(String secret) {
        try {
            return Decoders.BASE64.decode(secret);
        } catch (RuntimeException ex) {
            return secret.getBytes(StandardCharsets.UTF_8);
        }
    }
}
