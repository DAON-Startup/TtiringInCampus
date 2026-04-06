package api.domain.keyword.entity;

import api.domain.notice.entity.Notice;
import api.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "keyword_alerts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class KeywordAlert extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyword_id", nullable = false)
    private UserKeyword userKeyword;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notice_id", nullable = false)
    private Notice notice;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSent = false;

    private LocalDateTime sentAt;
}
