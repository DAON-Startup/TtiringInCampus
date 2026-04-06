package api.domain.keyword.controller;

import api.domain.keyword.dto.KeywordRequest;
import api.domain.keyword.dto.KeywordResponse;
import api.domain.keyword.service.KeywordService;
import api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Keyword", description = "키워드 알림 관련 API")
@RestController
@RequestMapping("/api/v1/keywords")
@RequiredArgsConstructor
public class KeywordController {

    private final KeywordService keywordService;

    @Operation(summary = "내 키워드 목록 조회", description = "현재 사용자가 등록한 모든 알림 키워드를 조회합니다.")
    @GetMapping
    public ApiResponse<List<KeywordResponse>> getKeywords(@AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(keywordService.getKeywords(userDetails.getUsername()));
    }

    @Operation(summary = "키워드 등록", description = "새로운 알림 키워드를 등록합니다.")
    @PostMapping
    public ApiResponse<KeywordResponse> addKeyword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody KeywordRequest request) {
        return ApiResponse.success(keywordService.addKeyword(userDetails.getUsername(), request));
    }

    @Operation(summary = "키워드 삭제", description = "등록된 알림 키워드를 삭제합니다.")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteKeyword(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        keywordService.deleteKeyword(userDetails.getUsername(), id);
        return ApiResponse.success(null);
    }
}
