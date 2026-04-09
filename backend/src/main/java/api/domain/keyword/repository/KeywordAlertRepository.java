package api.domain.keyword.repository;

import api.domain.keyword.entity.KeywordAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KeywordAlertRepository extends JpaRepository<KeywordAlert, Long> {
    List<KeywordAlert> findByIsSentFalse();
}
