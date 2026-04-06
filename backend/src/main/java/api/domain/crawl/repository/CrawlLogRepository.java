package api.domain.crawl.repository;

import api.domain.crawl.entity.CrawlLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrawlLogRepository extends JpaRepository<CrawlLog, Long> {
    List<CrawlLog> findBySource_SourceId(Long sourceId);
}
