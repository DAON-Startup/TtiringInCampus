package api.domain.notice.repository;

import api.domain.notice.entity.Notice;
import api.domain.notice.entity.NoticeCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    @EntityGraph(attributePaths = {"source"})
    Optional<Notice> findByUrlHash(String urlHash);

    @EntityGraph(attributePaths = {"source"})
    Page<Notice> findByCategory(NoticeCategory category, Pageable pageable);

    @EntityGraph(attributePaths = {"source"})
    Page<Notice> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM notices WHERE to_tsvector('simple', title) @@ plainto_tsquery('simple', :keyword)",
           countQuery = "SELECT count(*) FROM notices WHERE to_tsvector('simple', title) @@ plainto_tsquery('simple', :keyword)",
           nativeQuery = true)
    Page<Notice> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
