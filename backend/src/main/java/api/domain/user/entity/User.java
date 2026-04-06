package api.domain.user.entity;

import api.domain.university.entity.Department;
import api.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String nickname;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(length = 500)
    private String fcmToken;

    @Column(length = 500)
    private String refreshToken;

    @Column(nullable = false)
    @Builder.Default
    private Boolean notificationEnabled = true;

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
