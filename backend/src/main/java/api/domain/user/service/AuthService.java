package api.domain.user.service;

import api.domain.user.dto.LoginRequest;
import api.domain.user.dto.TokenResponse;
import api.domain.user.entity.User;
import api.domain.user.repository.UserRepository;
import api.global.auth.JwtProvider;
import api.global.error.CustomException;
import api.global.error.ErrorCode;
import api.infra.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RedisService redisService;

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGIN_FAILED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new CustomException(ErrorCode.LOGIN_FAILED);
        }

        String accessToken = jwtProvider.createAccessToken(user.getEmail());
        String refreshToken = jwtProvider.createRefreshToken(user.getEmail());

        user.updateRefreshToken(refreshToken);
        redisService.setData("RT:" + user.getEmail(), refreshToken, 604800);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        String email = jwtProvider.getEmailFromToken(refreshToken);
        String savedToken = redisService.getData("RT:" + email);

        if (savedToken == null || !savedToken.equals(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtProvider.createAccessToken(email);
        String newRefreshToken = jwtProvider.createRefreshToken(email);

        user.updateRefreshToken(newRefreshToken);
        redisService.setData("RT:" + email, newRefreshToken, 604800);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.updateRefreshToken(null);
        redisService.deleteData("RT:" + email);
    }
}
