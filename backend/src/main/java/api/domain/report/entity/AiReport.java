package api.domain.report.entity;

import api.domain.user.entity.User;
import api.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "ai_reports", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "report_date"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AiReport extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate reportDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summaryContent;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSent = false;
}
