package api.domain.notice.dto;

import api.domain.notice.entity.NoticeCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class NoticeBatchRequest {
    private Long sourceId;
    private List<NoticeItem> notices;

    @Getter
    @NoArgsConstructor
    public static class NoticeItem {
        private String externalId;
        private String title;
        private String url;
        private NoticeCategory category;
        private LocalDate postedDate;
        private String urlHash;
    }
}
