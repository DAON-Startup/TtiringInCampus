package api.domain.bookmark.controller;

import api.domain.bookmark.dto.BookmarkResponse;
import api.domain.bookmark.service.BookmarkService;
import api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Bookmark", description = "보관함 관련 API")
@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @Operation(summary = "내 보관함 목록 조회", description = "현재 사용자가 보관한 공지사항 목록을 조회합니다.")
    @GetMapping
    public ApiResponse<List<BookmarkResponse>> getBookmarks(@AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(bookmarkService.getBookmarks(userDetails.getUsername()));
    }

    @Operation(summary = "보관함 추가", description = "공지사항을 보관함에 추가합니다.")
    @PostMapping("/{noticeId}")
    public ApiResponse<BookmarkResponse> addBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("noticeId") Long noticeId) {
        return ApiResponse.success(bookmarkService.addBookmark(userDetails.getUsername(), noticeId));
    }

    @Operation(summary = "보관함 삭제", description = "보관함에서 공지사항을 삭제합니다.")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        bookmarkService.deleteBookmark(userDetails.getUsername(), id);
        return ApiResponse.success(null);
    }
}
