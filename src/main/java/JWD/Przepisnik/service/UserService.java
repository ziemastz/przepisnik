package JWD.Przepisnik.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import JWD.Przepisnik.exception.UserAlreadyExistsException;
import JWD.Przepisnik.models.User;
import JWD.Przepisnik.repository.UserRepository;
import JWD.Przepisnik.web.dto.UserDto;
import JWD.Przepisnik.web.mapper.UserMapper;

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
        if (userDto == null) {
            throw new IllegalArgumentException("UserDto cannot be null");
        }

        User user = userMapper.toEntity(userDto);

        Optional<User> byUsername = userRepository.findByUsername(userDto.username);
        if (byUsername.isPresent()) {
            throw new UserAlreadyExistsException(
                    String.format("Uzytkownik z loginem '%s' juz istnieje.", userDto.username));
        }

        Optional<User> byEmail = userRepository.findByEmail(userDto.email);
        if (byEmail.isPresent()) {
            throw new UserAlreadyExistsException(
                    String.format("Uzytkownik z e-mailem '%s' juz istnieje.", userDto.email));
        }

        return userRepository.save(user);
    }

    public Optional<User> updateUser(UUID id, UserDto userDto) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setUsername(userDto.username);
            existingUser.setEmail(userDto.email);
            existingUser.setName(userDto.name);
            existingUser.setSurname(userDto.surname);
            existingUser.setRole(userDto.role);

            if (userDto.password != null && !userDto.password.isBlank()) {
                existingUser.setPasswordHash(passwordEncoder.encode(userDto.password));
            }

            return userRepository.save(existingUser);
        });
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

}
