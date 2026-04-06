package api.domain.notice.controller;

import api.domain.notice.dto.NoticeListResponse;
import api.domain.notice.dto.NoticeResponse;
import api.domain.notice.entity.NoticeCategory;
import api.domain.notice.service.NoticeService;
import api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Notice", description = "공지사항 관련 API")
@RestController
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @Operation(summary = "공지사항 목록 조회", description = "카테고리별 공지사항 목록을 페이징하여 조회합니다.")
    @GetMapping
    public ApiResponse<NoticeListResponse> getNotices(
            @RequestParam(value = "category", required = false) NoticeCategory category,
            @PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(noticeService.getNotices(category, pageable));
    }

    @Operation(summary = "공지사항 상세 조회", description = "공지사항 ID로 상세 내용을 조회합니다.")
    @GetMapping("/{id}")
    public ApiResponse<NoticeResponse> getNotice(@PathVariable("id") Long id) {
        return ApiResponse.success(noticeService.getNotice(id));
    }

    @Operation(summary = "공지사항 검색", description = "제목 키워드로 공지사항을 검색합니다.")
    @GetMapping("/search")
    public ApiResponse<NoticeListResponse> searchNotices(
            @RequestParam("keyword") String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(noticeService.searchNotices(keyword, pageable));
    }
}
