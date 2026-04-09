package api.domain.notice.repository;

import api.domain.notice.entity.NoticeSource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeSourceRepository extends JpaRepository<NoticeSource, Long> {
    List<NoticeSource> findByEnabledTrue();
}
