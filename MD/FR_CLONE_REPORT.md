# FR_CLONE_REPORT.md — college_noti_front_end 검토 보고서

> 작성일: 2026-04-06  
> 대상 레포: https://github.com/Mujjin-adult/college_noti_front_end

---

## 1. 레포 기본 정보

| 항목 | 내용 |
|------|------|
| Owner | Mujjin-adult |
| 마지막 업데이트 | 2025-12-04 |
| 주요 브랜치 | dev (43 commits) |
| 언어 비율 | TypeScript 96%, JavaScript 3.5%, Shell 0.5% |
| 오픈 이슈 | 7개 |

---

## 2. 기술 스택

| 항목 | 버전 |
|------|------|
| React Native | 0.79.6 |
| Expo | ~53.0.23 |
| React | 19.0.0 |
| TypeScript | ~5.8.3 |
| Navigation | @react-navigation/native-stack + bottom-tabs |
| State | Zustand ^5.0.8 + React Context (BookmarkContext) |
| Auth | Firebase ^12.6.0 |
| Font | Pretendard (6 weights: Light, Regular, SemiBold, Bold, ExtraBold) |
| Animation | Lottie 7.2.2 + Reanimated 3 |
| Push Notification | expo-notifications + Firebase Cloud Messaging |
| HTTP | Axios (OpenAPI 자동 생성 클라이언트) |

---

## 3. 디렉토리 구조

```
college_noti_front_end/
├── screens/          (10개 화면)
├── components/
│   ├── login/        (인증 컴포넌트 4개)
│   ├── maincontents/ (메인 컨텐츠 컴포넌트 9개)
│   ├── bottombar/    (하단 탭바)
│   ├── topmenu/      (헤더, 카테고리 필터)
│   └── ui/           (아이콘, 탭 배경)
├── services/         (API 5개: apiClient, authAPI, crawlerAPI, userAPI, tokenService)
├── context/          (BookmarkContext)
├── hooks/            (useColorScheme, useThemeColor)
├── constants/        (Colors.ts)
├── config/           (firebaseConfig.ts)
└── assets/fonts/     (Pretendard otf 파일들)
```

---

## 4. 미완성/미구현 항목 (클론 시 주의)

| 항목 | 파일 | 심각도 | 상세 |
|------|------|--------|------|
| 이메일 인증 폴링 | components/maincontents/EmailVerificationModal.tsx | 🔴 미구현 | useEffect 내 TODO 주석만 있고 실제 polling 로직 없음. Firebase emailVerified 체크 미구현 |
| AI 챗봇 탭 | (없음) | 🟡 의도적 비활성화 | 탭 인덱스 2번 자리에 주석으로 "현재 미제공" 표시. 화면/컴포넌트 없음 |
| 관심 공지 컴포넌트 | (없음) | 🟡 미구현 | mainInterest.tsx 파일 없음. mainAll.tsx 내에 일부 필터 로직만 존재 |
| 동적 카테고리 | components/topmenu/all.tsx | 🟡 미완성 | availableCategories prop을 받지만 실제로는 하드코딩된 기본값 사용 |
| 검색 키워드 알림 UI | components/maincontents/alert.tsx | 🟡 불완전 | 8개 카테고리 UI는 있으나 세부 서브카테고리 데이터 일부 누락 |

---

## 5. 디자인 시스템 분석

### 5-1. 색상 팔레트

| 용도 | 색상 코드 |
|------|-----------|
| Primary (탭바 배경, 버튼) | `#3366FF` |
| 텍스트 기본 | `#11181C` |
| 배경 | `#ffffff` |
| 카테고리 뱃지 | `#8e8e8e` |
| 중요 공지 뱃지 | `red` |
| 읽은 공지 | `#909090` |
| 탭바 활성 텍스트 | `#000000` (검정) |
| 탭바 비활성 텍스트 | `#ffffff` (흰색) |

### 5-2. 폰트

| 용도 | Weight | Size |
|------|--------|------|
| 앱 타이틀 | ExtraBold | 32px |
| 화면 제목 | Bold | 20px |
| 공지 제목 | SemiBold | 16px |
| 본문 | Regular | 16px |
| 메타 정보 | Light | 12px |

### 5-3. 레이아웃 특징

- **탭바**: 파란색(`#3366FF`) 배경, 높이 49px, 활성=검정, 비활성=흰색
- **헤더**: 뒤로가기 버튼(←) + 중앙 제목 + 우측 알림벨 아이콘, 고정 높이
- **공지 카드**: 약 80px 높이, shadowColor + elevation 그림자
- **카테고리 필터**: 하단 언더라인 스타일 (pill 아님), 가로 스크롤
- **상세 화면**: 북마크 버튼 + 공유 버튼 + 원본 보기 버튼

---

## 6. TtiringInCampus 현재 버전과 차이점

| 디자인 요소 | TtiringInCampus (현재) | college_noti (클론 대상) |
|------------|----------------------|------------------------|
| Primary 색상 | `#005bac` (인천대 파랑) | `#3366FF` (밝은 파랑) |
| 탭바 배경 | 흰색 (기본 RN) | `#3366FF` 파란색 |
| 탭바 텍스트 | 파랑/회색 | 검정(활성)/흰색(비활성) |
| 폰트 | 시스템 폰트 | Pretendard 커스텀 폰트 |
| 헤더 컴포넌트 | 없음 (탭 제목만) | 별도 Header 컴포넌트 |
| 공지 카드 | border-bottom 구분선 | shadow + elevation 카드 |
| 카테고리 필터 | 둥근 pill 스타일 | 하단 underline 스타일 |
| 상세 화면 | 단순 WebView / 링크버튼 | 북마크/공유 액션 버튼 포함 |
| 로그인 화면 | 단순 텍스트 타이틀 | 로고 이미지 + 세련된 form |

---

## 7. 클론 불포함 항목 (TtiringInCampus 유지)

- **Firebase 인증** → JWT 기반 인증 유지
- **EmailVerification 화면** → 미완성이므로 클론하지 않음
- **AI 챗봇 탭** → 미구현이므로 추가하지 않음
- **BookmarkContext** → 현재 API 기반 북마크 유지
- **OpenAPI 자동 생성 클라이언트** → 기존 axios 클라이언트 유지
