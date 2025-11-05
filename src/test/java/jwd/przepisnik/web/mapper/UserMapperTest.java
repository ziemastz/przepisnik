package jwd.przepisnik.web.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import jwd.przepisnik.models.User;
import jwd.przepisnik.web.dto.UserDto;

@ExtendWith(MockitoExtension.class)
class UserMapperTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserMapper userMapper;

    @Test
    void toEntityShouldMapAllFields() {
        when(passwordEncoder.encode("secret")).thenReturn("encoded");
        UserDto dto = new UserDto("john", "secret", "john@example.com", "John", "Doe", "USER");

        User entity = userMapper.toEntity(dto);

        assertEquals("john", entity.getUsername());
        assertEquals("encoded", entity.getPasswordHash());
        assertEquals("john@example.com", entity.getEmail());
        assertEquals("John", entity.getName());
        assertEquals("Doe", entity.getSurname());
        assertEquals("USER", entity.getRole());
        verify(passwordEncoder).encode("secret");
    }

    @Test
    void toEntityShouldReturnNullForNullDto() {
        assertNull(userMapper.toEntity(null));
    }

    @Test
    void toEntityShouldRejectBlankPassword() {
        UserDto dto = new UserDto("john", "   ", "john@example.com", "John", "Doe", "USER");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> userMapper.toEntity(dto));

        assertEquals("HasĹ‚o nie moĹĽe byÄ‡ puste.", exception.getMessage());
    }

    @Test
    void toDtoShouldMapFields() {
        User user = new User();
        user.setUsername("john");
        user.setPasswordHash("hash");
        user.setEmail("john@example.com");
        user.setName("John");
        user.setSurname("Doe");
        user.setRole("USER");

        UserDto dto = userMapper.toDto(user);

        assertEquals("john", dto.getUsername());
        assertNull(dto.getPassword());
        assertEquals("john@example.com", dto.getEmail());
        assertEquals("John", dto.getName());
        assertEquals("Doe", dto.getSurname());
        assertEquals("USER", dto.getRole());
    }

    @Test
    void toDtoShouldReturnNullForNullUser() {
        assertNull(userMapper.toDto(null));
    }
}
