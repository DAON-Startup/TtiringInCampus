package api.domain.notice.controller;

import api.domain.crawl.dto.CrawlLogRequest;
import api.domain.notice.dto.NoticeBatchRequest;
import api.domain.notice.service.InternalNoticeService;
import api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Internal", description = "내부 크롤러 연동 API")
@RestController
@RequestMapping("/internal/v1")
@RequiredArgsConstructor
public class InternalController {

    private final InternalNoticeService internalNoticeService;

    @Operation(summary = "공지사항 일괄 저장", description = "크롤러로부터 수집된 공지사항 목록을 일괄 저장합니다.")
    @PostMapping("/notices/batch")
    public ApiResponse<Void> saveNoticeBatch(@Valid @RequestBody NoticeBatchRequest request) {
        internalNoticeService.saveNoticeBatch(request);
        return ApiResponse.success(null);
    }

    @Operation(summary = "크롤링 로그 저장", description = "크롤링 작업 결과를 로그로 저장합니다.")
    @PostMapping("/crawl-logs")
    public ApiResponse<Void> saveCrawlLog(@Valid @RequestBody CrawlLogRequest request) {
        internalNoticeService.saveCrawlLog(request);
        return ApiResponse.success(null);
    }
}
