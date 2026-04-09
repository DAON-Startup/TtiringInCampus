package api.domain.bookmark.service;

import api.domain.bookmark.dto.BookmarkResponse;
import api.domain.bookmark.entity.Bookmark;
import api.domain.bookmark.repository.BookmarkRepository;
import api.domain.notice.entity.Notice;
import api.domain.notice.repository.NoticeRepository;
import api.domain.user.entity.User;
import api.domain.user.repository.UserRepository;
import api.global.error.CustomException;
import api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<BookmarkResponse> getBookmarks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return bookmarkRepository.findByUser_UserId(user.getUserId()).stream()
                .map(BookmarkResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookmarkResponse addBookmark(String email, Long noticeId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));

        if (bookmarkRepository.existsByUser_UserIdAndNotice_NoticeId(user.getUserId(), noticeId)) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE); // Already bookmarked
        }

        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .notice(notice)
                .build();

        return BookmarkResponse.from(bookmarkRepository.save(bookmark));
    }

    @Transactional
    public void deleteBookmark(String email, Long bookmarkId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT_VALUE));

        if (!bookmark.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        bookmarkRepository.delete(bookmark);
    }
}
