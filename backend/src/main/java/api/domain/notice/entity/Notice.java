package api.domain.notice.entity;

import api.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "notices")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Notice extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noticeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    private NoticeSource source;

    @Column(length = 100)
    private String externalId;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, length = 1000)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeCategory category;

    private LocalDate postedDate;

    @Column(nullable = false, length = 64, unique = true)
    private String urlHash;
}
