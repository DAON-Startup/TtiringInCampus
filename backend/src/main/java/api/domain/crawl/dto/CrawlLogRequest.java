package api.domain.crawl.dto;

import api.domain.crawl.entity.CrawlStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CrawlLogRequest {
    private Long sourceId;
    private CrawlStatus status;
    private Integer noticesFound;
    private Integer newNotices;
    private String errorMessage;
    private Integer responseTimeMs;
}
