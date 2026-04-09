package api.domain.report.repository;

import api.domain.report.entity.AiReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AiReportRepository extends JpaRepository<AiReport, Long> {
    List<AiReport> findByUser_UserId(Long userId);
    Optional<AiReport> findByUser_UserIdAndReportDate(Long userId, LocalDate reportDate);
}
