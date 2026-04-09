package api.domain.notice.service;

import api.domain.crawl.dto.CrawlLogRequest;
import api.domain.crawl.entity.CrawlLog;
import api.domain.crawl.repository.CrawlLogRepository;
import api.domain.notice.dto.NoticeBatchRequest;
import api.domain.notice.entity.Notice;
import api.domain.notice.entity.NoticeSource;
import api.domain.notice.repository.NoticeRepository;
import api.domain.notice.repository.NoticeSourceRepository;
import api.global.error.CustomException;
import api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InternalNoticeService {

    private final NoticeRepository noticeRepository;
    private final NoticeSourceRepository noticeSourceRepository;
    private final CrawlLogRepository crawlLogRepository;

    @Transactional
    public void saveNoticeBatch(NoticeBatchRequest request) {
        NoticeSource source = noticeSourceRepository.findById(request.getSourceId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT_VALUE));

        List<Notice> newNotices = new ArrayList<>();
        for (NoticeBatchRequest.NoticeItem item : request.getNotices()) {
            if (noticeRepository.findByUrlHash(item.getUrlHash()).isPresent()) {
                continue;
            }

            Notice notice = Notice.builder()
                    .source(source)
                    .externalId(item.getExternalId())
                    .title(item.getTitle())
                    .url(item.getUrl())
                    .category(item.getCategory() != null ? item.getCategory() : source.getCategory())
                    .postedDate(item.getPostedDate())
                    .urlHash(item.getUrlHash())
                    .build();
            newNotices.add(notice);
        }

        if (!newNotices.isEmpty()) {
            noticeRepository.saveAll(newNotices);
            log.info("Saved {} new notices for source {}", newNotices.size(), source.getName());
        }
    }

    @Transactional
    public void saveCrawlLog(CrawlLogRequest request) {
        NoticeSource source = noticeSourceRepository.findById(request.getSourceId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT_VALUE));

        CrawlLog logEntry = CrawlLog.builder()
                .source(source)
                .status(request.getStatus())
                .noticesFound(request.getNoticesFound())
                .newNotices(request.getNewNotices())
                .errorMessage(request.getErrorMessage())
                .responseTimeMs(request.getResponseTimeMs())
                .build();

        crawlLogRepository.save(logEntry);
    }
}
