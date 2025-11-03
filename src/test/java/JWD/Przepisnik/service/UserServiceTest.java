package jwd.przepisnik.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import jwd.przepisnik.exception.UserAlreadyExistsException;
import jwd.przepisnik.models.User;
import jwd.przepisnik.repository.UserRepository;
import jwd.przepisnik.web.dto.UserDto;
import jwd.przepisnik.web.mapper.UserMapper;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserDto sampleDto;
    private User mappedUser;

    @BeforeEach
    void setUp() {
        sampleDto = new UserDto("john", "secret", "john@example.com", "John", "Doe", "USER");
        mappedUser = new User();
        mappedUser.setUsername("john");
    }

    @Test
    void createUserShouldPersistNewUser() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(userMapper.toEntity(sampleDto)).thenReturn(mappedUser);
        when(userRepository.save(mappedUser)).thenReturn(mappedUser);

        User result = userService.createUser(sampleDto);

        assertSame(mappedUser, result);
        verify(userRepository).save(mappedUser);
    }

    @Test
    void createUserShouldThrowForNullDto() {
        NullPointerException exception = assertThrows(NullPointerException.class, () -> userService.createUser(null));
        assertEquals("Obiekt UserDto nie moze byc pusty.", exception.getMessage());
    }

    @Test
    void createUserShouldRejectDuplicateUsername() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(sampleDto));
        verify(userRepository, never()).save(any());
    }

    @Test
    void createUserShouldRejectDuplicateEmail() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(sampleDto));
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUserShouldUpdateFieldsAndEncodePassword() {
        UUID userId = UUID.randomUUID();
        User existing = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.of(existing));
        when(passwordEncoder.encode("newSecret")).thenReturn("encoded");

        UserDto updateDto = new UserDto("newName", "newSecret", "new@example.com", "New", "Name", "ADMIN");
        when(userRepository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<User> result = userService.updateUser(userId, updateDto);

        assertTrue(result.isPresent());
        assertEquals("newName", existing.getUsername());
        assertEquals("new@example.com", existing.getEmail());
        assertEquals("New", existing.getName());
        assertEquals("Name", existing.getSurname());
        assertEquals("ADMIN", existing.getRole());
        assertEquals("encoded", existing.getPasswordHash());
        verify(passwordEncoder).encode("newSecret");
        verify(userRepository).save(existing);
    }

    @Test
    void updateUserShouldSkipPasswordEncodingWhenBlank() {
        UUID userId = UUID.randomUUID();
        User existing = new User();
        existing.setPasswordHash("old");
        when(userRepository.findById(userId)).thenReturn(Optional.of(existing));
        UserDto updateDto = new UserDto("newName", "   ", "new@example.com", "New", "Name", "ADMIN");
        when(userRepository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<User> result = userService.updateUser(userId, updateDto);

        assertTrue(result.isPresent());
        assertEquals("old", existing.getPasswordHash());
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void updateUserShouldReturnEmptyWhenUserMissing() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<User> result = userService.updateUser(userId, sampleDto);

        assertTrue(result.isEmpty());
    }

    @Test
    void updateUserShouldThrowForNullDto() {
        UUID userId = UUID.randomUUID();

        NullPointerException exception = assertThrows(NullPointerException.class, () -> userService.updateUser(userId, null));
        assertEquals("Obiekt UserDto nie moze byc pusty.", exception.getMessage());
    }
}
