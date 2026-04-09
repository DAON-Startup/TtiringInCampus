package api.domain.report.dto;

import api.domain.report.entity.AiReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class ReportResponse {
    private Long reportId;
    private LocalDate reportDate;
    private String summaryContent;

    public static ReportResponse from(AiReport aiReport) {
        return ReportResponse.builder()
                .reportId(aiReport.getReportId())
                .reportDate(aiReport.getReportDate())
                .summaryContent(aiReport.getSummaryContent())
                .build();
    }
}
