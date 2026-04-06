package api.domain.crawl.entity;

import api.domain.notice.entity.NoticeSource;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "crawl_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CrawlLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    private NoticeSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CrawlStatus status;

    @Builder.Default
    private Integer noticesFound = 0;

    @Builder.Default
    private Integer newNotices = 0;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "response_time_ms")
    private Integer responseTimeMs;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime executedAt = LocalDateTime.now();
}
