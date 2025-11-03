package jwd.przepisnik.security;

import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jwd.przepisnik.models.User;

public class UserPrincipal implements UserDetails {
    private final UUID id;
    private final String username;
    private final String password;
    private final List<GrantedAuthority> authorities;

    private UserPrincipal(UUID id, String username, String password, List<GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrincipal from(User user) {
        String role = user.getRole() != null ? user.getRole() : "USER";
        String normalizedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase(Locale.ROOT);
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(normalizedRole));
        return new UserPrincipal(user.getId(), user.getUsername(), user.getPasswordHash(), authorities);
    }

    public UUID getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
