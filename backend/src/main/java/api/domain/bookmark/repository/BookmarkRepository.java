package api.domain.bookmark.repository;

import api.domain.bookmark.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser_UserId(Long userId);
    boolean existsByUser_UserIdAndNotice_NoticeId(Long userId, Long noticeId);
}
