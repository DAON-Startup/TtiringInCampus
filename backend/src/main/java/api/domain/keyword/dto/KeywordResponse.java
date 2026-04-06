package api.domain.keyword.dto;

import api.domain.keyword.entity.UserKeyword;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class KeywordResponse {
    private Long keywordId;
    private String keyword;
    private Boolean alertEnabled;

    public static KeywordResponse from(UserKeyword userKeyword) {
        return KeywordResponse.builder()
                .keywordId(userKeyword.getKeywordId())
                .keyword(userKeyword.getKeyword())
                .alertEnabled(userKeyword.getAlertEnabled())
                .build();
    }
}
