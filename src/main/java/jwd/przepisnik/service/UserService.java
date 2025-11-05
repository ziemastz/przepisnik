package jwd.przepisnik.service;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jwd.przepisnik.exception.UserAlreadyExistsException;
import jwd.przepisnik.models.User;
import jwd.przepisnik.repository.UserRepository;
import jwd.przepisnik.web.dto.UserDto;
import jwd.przepisnik.web.mapper.UserMapper;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(UserDto userDto) {
        Objects.requireNonNull(userDto, "Obiekt UserDto nie moze byc pusty.");

        ensureUserIsUnique(userDto);

        User user = userMapper.toEntity(userDto);

        return userRepository.save(user);
    }

    public Optional<User> updateUser(UUID id, UserDto userDto) {
        Objects.requireNonNull(userDto, "Obiekt UserDto nie moze byc pusty.");

        return userRepository.findById(id)
                .map(existingUser -> {
                    applyUserUpdates(existingUser, userDto);
                    return userRepository.save(existingUser);
                });
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    private void ensureUserIsUnique(UserDto userDto) {
        userRepository.findByUsername(userDto.getUsername())
                .ifPresent(existing -> {
                    throw new UserAlreadyExistsException(
                            String.format("Uzytkownik z loginem '%s' juz istnieje.", userDto.getUsername()));
                });

        userRepository.findByEmail(userDto.getEmail())
                .ifPresent(existing -> {
                    throw new UserAlreadyExistsException(
                            String.format("Uzytkownik z e-mailem '%s' juz istnieje.", userDto.getEmail()));
                });
    }

    private void applyUserUpdates(User user, UserDto userDto) {
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setSurname(userDto.getSurname());
        user.setRole(userDto.getRole());

        if (hasText(userDto.getPassword())) {
            user.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
