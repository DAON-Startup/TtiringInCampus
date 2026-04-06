package api.domain.report.controller;

import api.domain.report.dto.ReportResponse;
import api.domain.report.service.AiReportService;
import api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Report", description = "AI 리포트 관련 API")
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final AiReportService aiReportService;

    @Operation(summary = "내 AI 리포트 목록 조회", description = "현재 사용자의 모든 AI 요약 리포트를 조회합니다.")
    @GetMapping
    public ApiResponse<List<ReportResponse>> getReports(@AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(aiReportService.getReports(userDetails.getUsername()));
    }

    @Operation(summary = "AI 리포트 상세 조회", description = "특정 AI 리포트의 상세 내용을 조회합니다.")
    @GetMapping("/{id}")
    public ApiResponse<ReportResponse> getReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        return ApiResponse.success(aiReportService.getReport(userDetails.getUsername(), id));
    }
}
