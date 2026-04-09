package api.domain.notice.dto;

import api.domain.notice.entity.Notice;
import api.domain.notice.entity.NoticeCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class NoticeResponse {
    private Long noticeId;
    private String title;
    private String url;
    private NoticeCategory category;
    private LocalDate postedDate;
    private String sourceName;

    public static NoticeResponse from(Notice notice) {
        return NoticeResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .url(notice.getUrl())
                .category(notice.getCategory())
                .postedDate(notice.getPostedDate())
                .sourceName(notice.getSource().getName())
                .build();
    }
}
