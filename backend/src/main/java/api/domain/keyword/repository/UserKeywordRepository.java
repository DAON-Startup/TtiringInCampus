package api.domain.keyword.repository;

import api.domain.keyword.entity.UserKeyword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserKeywordRepository extends JpaRepository<UserKeyword, Long> {
    List<UserKeyword> findByUser_UserId(Long userId);
    List<UserKeyword> findByAlertEnabledTrue();
}
