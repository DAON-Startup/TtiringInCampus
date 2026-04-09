# CLONE_PLAN.md — 클론 코딩 실행 계획

> 작성일: 2026-04-06  
> 참조 레포: https://github.com/Mujjin-adult/college_noti_front_end  
> 작업 대상: TtiringInCampus/frontend/

---

## 클론 범위

| 항목 | 포함 여부 |
|------|-----------|
| 색상 시스템 (#3366FF) | ✅ |
| Pretendard 폰트 | ✅ |
| 탭바 디자인 (파란 배경) | ✅ |
| Header 컴포넌트 | ✅ |
| 공지 카드 (shadow 스타일) | ✅ |
| 카테고리 필터 (underline) | ✅ |
| 상세화면 북마크/공유 버튼 | ✅ |
| 로그인 화면 재설계 | ✅ |
| Firebase 인증 | ❌ (JWT 유지) |
| EmailVerification 화면 | ❌ (미구현) |
| AI 챗봇 탭 | ❌ (미구현) |
| OpenAPI 자동생성 클라이언트 | ❌ (기존 axios 유지) |

---

## 추가 의존성

```json
"expo-font": "~11.10.3"
```

---

## 추가 에셋 (assets/fonts/)

| 파일명 | 용도 |
|--------|------|
| Pretendard-Regular.otf | 본문 기본 |
| Pretendard-Medium.otf | 중간 강조 |
| Pretendard-SemiBold.otf | 공지 제목, 버튼 |
| Pretendard-Bold.otf | 화면 제목 |
| Pretendard-ExtraBold.otf | 앱 타이틀 |

다운로드 출처: https://github.com/orioncactus/pretendard/releases

---

## 파일별 변경 목록

### 신규 생성

| 파일 | 내용 |
|------|------|
| `src/components/layout/Header.tsx` | title + 선택적 뒤로가기 + 알림벨 |

### 수정

| 파일 | 주요 변경 |
|------|-----------|
| `package.json` | expo-font 추가 |
| `App.tsx` | useFonts Pretendard 로딩, SplashScreen |
| `src/styles/tokens.ts` | primary #3366FF, fontFamily 추가 |
| `src/navigation/AppNavigator.tsx` | 탭바 파란 배경, 아이콘, 스타일 |
| `src/components/common/NoticeCard.tsx` | shadow 카드, underline 카테고리 뱃지 |
| `src/screens/home/HomeScreen.tsx` | Header + underline 카테고리 필터 |
| `src/screens/auth/LoginScreen.tsx` | 로고 + 폼 재설계 |
| `src/screens/auth/SignupScreen.tsx` | 폼 재설계 |
| `src/screens/notice/NoticeDetailScreen.tsx` | 북마크/공유 버튼 추가 |
| `src/screens/search/SearchScreen.tsx` | Header + 검색바 재설계 |
| `src/screens/bookmark/BookmarkScreen.tsx` | Header + 빈 상태 개선 |
| `src/screens/report/ReportScreen.tsx` | Header + 카드 재설계 |
| `src/screens/settings/SettingsScreen.tsx` | Header 추가 |

---

## 구현 순서

```
1. MD 폴더 + FR_CLONE_REPORT.md + CLONE_PLAN.md 생성
2. Pretendard 폰트 파일 다운로드 → assets/fonts/
3. package.json — expo-font 추가 + npx expo install
4. src/styles/tokens.ts — 색상 + 폰트 패밀리
5. App.tsx — expo-font 로딩
6. src/components/layout/Header.tsx — 신규
7. src/navigation/AppNavigator.tsx — 탭바 스타일
8. src/components/common/NoticeCard.tsx — 카드 리디자인
9. src/screens/home/HomeScreen.tsx
10. src/screens/auth/LoginScreen.tsx + SignupScreen.tsx
11. src/screens/notice/NoticeDetailScreen.tsx
12. src/screens/search/SearchScreen.tsx
13. src/screens/bookmark/BookmarkScreen.tsx
14. src/screens/report/ReportScreen.tsx
15. src/screens/settings/SettingsScreen.tsx
16. npx tsc --noEmit 검증
17. npx expo export --platform web 검증
```

---

## 검증 체크리스트

- [ ] TypeScript 타입 오류 없음 (`npx tsc --noEmit`)
- [ ] 웹 빌드 성공 (`npx expo export --platform web`)
- [ ] 로그인 화면 로고 표시 확인
- [ ] 탭바 파란색 배경 확인
- [ ] Pretendard 폰트 렌더링 확인
- [ ] 공지 카드 shadow 확인
- [ ] 카테고리 필터 underline 스타일 확인
- [ ] 공지 상세 북마크/공유 버튼 확인
- [ ] Header 뒤로가기 동작 확인

---

## 예상 소요 시간 및 토큰

| 항목 | 예상 |
|------|------|
| 수정/생성 파일 수 | 15개 |
| 코드 라인 수 | ~1,800줄 |
| 예상 소요 시간 | **30~40분** |
| 예상 토큰 사용량 | **약 70,000~100,000 tokens** |
