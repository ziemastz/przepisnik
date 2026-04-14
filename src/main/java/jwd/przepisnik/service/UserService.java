package jwd.przepisnik.service;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jwd.przepisnik.constants.AppMessages;
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
        Objects.requireNonNull(userDto, AppMessages.Service.USER_DTO_REQUIRED);

        ensureUserIsUnique(userDto);

        User user = userMapper.toEntity(userDto);

        return userRepository.save(user);
    }

    public Optional<User> updateUser(UUID id, UserDto userDto) {
        Objects.requireNonNull(userDto, AppMessages.Service.USER_DTO_REQUIRED);

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

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    private void ensureUserIsUnique(UserDto userDto) {
        userRepository.findByUsername(userDto.username())
                .ifPresent(existing -> {
                    throw new UserAlreadyExistsException(
                            String.format(AppMessages.Service.USERNAME_EXISTS_PATTERN, userDto.username()));
                });

        userRepository.findByEmail(userDto.email())
                .ifPresent(existing -> {
                    throw new UserAlreadyExistsException(
                            String.format(AppMessages.Service.EMAIL_EXISTS_PATTERN, userDto.email()));
                });
    }

    private void applyUserUpdates(User user, UserDto userDto) {
        user.setUsername(userDto.username());
        user.setEmail(userDto.email());
        user.setName(userDto.name());
        user.setSurname(userDto.surname());
        user.setRole(userDto.role());

        if (hasText(userDto.password())) {
            user.setPasswordHash(passwordEncoder.encode(userDto.password()));
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
