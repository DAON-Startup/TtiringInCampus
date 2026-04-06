package api.domain.keyword.service;

import api.domain.keyword.dto.KeywordRequest;
import api.domain.keyword.dto.KeywordResponse;
import api.domain.keyword.entity.UserKeyword;
import api.domain.keyword.repository.UserKeywordRepository;
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
public class KeywordService {

    private final UserKeywordRepository userKeywordRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<KeywordResponse> getKeywords(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return userKeywordRepository.findByUser_UserId(user.getUserId()).stream()
                .map(KeywordResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public KeywordResponse addKeyword(String email, KeywordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        UserKeyword userKeyword = UserKeyword.builder()
                .user(user)
                .keyword(request.getKeyword())
                .alertEnabled(true)
                .build();

        return KeywordResponse.from(userKeywordRepository.save(userKeyword));
    }

    @Transactional
    public void deleteKeyword(String email, Long keywordId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        UserKeyword userKeyword = userKeywordRepository.findById(keywordId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT_VALUE));

        if (!userKeyword.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        userKeywordRepository.delete(userKeyword);
    }
}
