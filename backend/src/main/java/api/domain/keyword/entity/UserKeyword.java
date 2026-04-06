package api.domain.keyword.entity;

import api.domain.user.entity.User;
import api.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_keywords")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserKeyword extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long keywordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String keyword;

    @Column(nullable = false)
    @Builder.Default
    private Boolean alertEnabled = true;
}
