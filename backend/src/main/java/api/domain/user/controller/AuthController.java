package api.domain.user.controller;

import api.domain.user.dto.LoginRequest;
import api.domain.user.dto.TokenResponse;
import api.domain.user.service.AuthService;
import api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "인증 관련 API")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인을 진행하고 JWT 토큰을 발급합니다.")
    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @Operation(summary = "토큰 갱신", description = "Refresh Token을 이용해 Access Token과 Refresh Token을 갱신합니다.")
    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestParam("refreshToken") String refreshToken) {
        return ApiResponse.success(authService.refresh(refreshToken));
    }

    @Operation(summary = "로그아웃", description = "현재 사용자의 Refresh Token을 무효화합니다.")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
        authService.logout(userDetails.getUsername());
        return ApiResponse.success(null);
    }
}
