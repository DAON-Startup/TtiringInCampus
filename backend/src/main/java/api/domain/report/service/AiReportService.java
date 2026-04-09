package api.domain.report.service;

import api.domain.report.dto.ReportResponse;
import api.domain.report.repository.AiReportRepository;
import api.domain.user.entity.User;
import api.domain.user.repository.UserRepository;
import api.global.error.CustomException;
import api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiReportService {

    private final AiReportRepository aiReportRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ReportResponse> getReports(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return aiReportRepository.findByUser_UserId(user.getUserId()).stream()
                .map(ReportResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReportResponse getReport(String email, Long reportId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return aiReportRepository.findById(reportId)
                .filter(report -> report.getUser().getUserId().equals(user.getUserId()))
                .map(ReportResponse::from)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT_VALUE));
    }
}
