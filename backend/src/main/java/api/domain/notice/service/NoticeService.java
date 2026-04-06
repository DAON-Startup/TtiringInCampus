package api.domain.notice.service;

import api.domain.notice.dto.NoticeListResponse;
import api.domain.notice.dto.NoticeResponse;
import api.domain.notice.entity.Notice;
import api.domain.notice.entity.NoticeCategory;
import api.domain.notice.repository.NoticeRepository;
import api.global.error.CustomException;
import api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Transactional(readOnly = true)
    public NoticeListResponse getNotices(NoticeCategory category, Pageable pageable) {
        Page<Notice> noticePage;
        if (category == null) {
            noticePage = noticeRepository.findAll(pageable);
        } else {
            noticePage = noticeRepository.findByCategory(category, pageable);
        }

        return NoticeListResponse.builder()
                .notices(noticePage.getContent().stream().map(NoticeResponse::from).collect(Collectors.toList()))
                .totalCount(noticePage.getTotalElements())
                .totalPages(noticePage.getTotalPages())
                .currentPage(noticePage.getNumber())
                .build();
    }

    @Transactional(readOnly = true)
    public NoticeResponse getNotice(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));
        return NoticeResponse.from(notice);
    }

    @Transactional(readOnly = true)
    public NoticeListResponse searchNotices(String keyword, Pageable pageable) {
        // Fulltext search requires specific format for keyword (e.g., 'word1 | word2')
        // For simplicity, we just use the keyword directly here.
        // In real world, we might want to pre-process it.
        Page<Notice> noticePage = noticeRepository.searchByKeyword(keyword, pageable);

        return NoticeListResponse.builder()
                .notices(noticePage.getContent().stream().map(NoticeResponse::from).collect(Collectors.toList()))
                .totalCount(noticePage.getTotalElements())
                .totalPages(noticePage.getTotalPages())
                .currentPage(noticePage.getNumber())
                .build();
    }
}
