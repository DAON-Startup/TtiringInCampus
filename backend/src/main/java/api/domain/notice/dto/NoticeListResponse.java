package api.domain.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class NoticeListResponse {
    private List<NoticeResponse> notices;
    private long totalCount;
    private int totalPages;
    private int currentPage;
}
