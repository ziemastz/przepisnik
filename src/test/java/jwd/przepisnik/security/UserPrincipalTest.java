package jwd.przepisnik.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.models.User;

class UserPrincipalTest {

    @Test
    void shouldUseDefaultRoleWhenUserRoleIsNull() {
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);
        user.setUsername("john@example.com");
        user.setPasswordHash("encoded");
        user.setRole(null);

        UserPrincipal principal = UserPrincipal.from(user);

        assertThat(principal.getId()).isEqualTo(userId);
        assertThat(principal.getUsername()).isEqualTo("john@example.com");
        assertThat(principal.getPassword()).isEqualTo("encoded");
        assertThat(principal.getAuthorities()).extracting("authority")
                .containsExactly(AppMessages.Security.ROLE_PREFIX + AppMessages.Security.DEFAULT_ROLE);
        assertThat(principal.isAccountNonExpired()).isTrue();
        assertThat(principal.isAccountNonLocked()).isTrue();
        assertThat(principal.isCredentialsNonExpired()).isTrue();
        assertThat(principal.isEnabled()).isTrue();
    }

    @Test
    void shouldKeepPrefixedRoleWithoutAddingPrefixAgain() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("admin@example.com");
        user.setPasswordHash("encoded");
        user.setRole("ROLE_admin");

        UserPrincipal principal = UserPrincipal.from(user);

        assertThat(principal.getAuthorities()).extracting("authority")
                .containsExactly("ROLE_admin");
    }
}
