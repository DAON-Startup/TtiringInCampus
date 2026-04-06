package api.domain.notice.entity;

import api.domain.university.entity.University;
import api.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notice_sources")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class NoticeSource extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sourceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeCategory category;

    @Column(nullable = false, length = 500)
    private String baseUrl;

    @Column(length = 500)
    private String listUrlTemplate;

    @Column(columnDefinition = "TEXT")
    private String llmParsePrompt;

    @Column(length = 50)
    @Builder.Default
    private String schedule = "0 */1 * * *";

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;
}
