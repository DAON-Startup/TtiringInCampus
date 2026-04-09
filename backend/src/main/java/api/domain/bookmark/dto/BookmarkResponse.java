package api.domain.bookmark.dto;

import api.domain.bookmark.entity.Bookmark;
import api.domain.notice.dto.NoticeResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BookmarkResponse {
    private Long bookmarkId;
    private NoticeResponse notice;

    public static BookmarkResponse from(Bookmark bookmark) {
        return BookmarkResponse.builder()
                .bookmarkId(bookmark.getBookmarkId())
                .notice(NoticeResponse.from(bookmark.getNotice()))
                .build();
    }
}
