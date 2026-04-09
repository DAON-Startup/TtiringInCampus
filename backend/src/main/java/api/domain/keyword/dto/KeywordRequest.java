package api.domain.keyword.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KeywordRequest {
    @NotBlank
    private String keyword;
}
