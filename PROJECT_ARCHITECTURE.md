# PROJECT_ARCHITECTURE.md — 띠링인캠퍼스 프로젝트 설계서

> **목적**: Claude Code가 이 문서를 읽고 프로젝트를 세팅하고 코드를 작성할 수 있도록 모든 설계 정보를 담은 문서.
> **마지막 업데이트**: 2026-04-04

---

## 1. 프로젝트 개요

인천대학교의 모든 공지사항을 하나의 앱에서 통합 열람하고, AI가 매일 아침 요약 리포트를 제공하는 서비스.

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 띠링인캠퍼스 (TtiringInCampus) |
| 대상 사용자 | 인천대학교 재학생 |
| 핵심 가치 | 정보가 사용자에게 찾아오게 한다 |
| 개발 인원 | 1인 (조성훈) |

---

## 2. 기술 스택

| 레이어 | 기술 | 버전 |
|--------|------|------|
| 백엔드 | Java / Spring Boot | 17 / 3.3.5 |
| 프론트엔드 | React Native / TypeScript | 0.75.4 |
| 크롤링 | n8n + LLM (HTML→JSON 파싱) | latest |
| DB | PostgreSQL | 16 |
| 캐시 | Redis | 7 |
| 푸시 | Firebase Cloud Messaging (FCM) | - |
| AI 리포트 | Claude Haiku API | - |
| 컨테이너 | Docker / Docker Compose | - |
| CI/CD | GitHub Actions | - |

---

## 3. 폴더 구조 (목표 상태)

```
TtiringInCampus/
├── .ai/                        # AI 에이전트 시스템 (개발 도구)
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   │   ├── pr-check.yml        # CI: PR 시 Gradle 빌드+테스트
│   │   └── deploy.yml          # CD: 수동 배포
│   └── PULL_REQUEST_TEMPLATE.md
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── api/        # 실제 패키지: com.univnotice.api
│   │       │       ├── domain/
│   │       │       │   ├── bookmark/
│   │       │       │   │   ├── controller/
│   │       │       │   │   ├── dto/
│   │       │       │   │   ├── entity/
│   │       │       │   │   ├── repository/
│   │       │       │   │   └── service/
│   │       │       │   ├── crawl/
│   │       │       │   │   ├── controller/
│   │       │       │   │   ├── dto/
│   │       │       │   │   ├── entity/
│   │       │       │   │   ├── repository/
│   │       │       │   │   └── service/
│   │       │       │   ├── keyword/
│   │       │       │   │   ├── controller/
│   │       │       │   │   ├── dto/
│   │       │       │   │   ├── entity/
│   │       │       │   │   ├── repository/
│   │       │       │   │   └── service/
│   │       │       │   ├── notice/
│   │       │       │   │   ├── controller/
│   │       │       │   │   ├── dto/
│   │       │       │   │   ├── entity/
│   │       │       │   │   ├── repository/
│   │       │       │   │   └── service/
│   │       │       │   ├── report/
│   │       │       │   │   ├── controller/
│   │       │       │   │   ├── dto/
│   │       │       │   │   ├── entity/
│   │       │       │   │   ├── repository/
│   │       │       │   │   └── service/
│   │       │       │   └── user/
│   │       │       │       ├── controller/
│   │       │       │       ├── dto/
│   │       │       │       ├── entity/
│   │       │       │       ├── repository/
│   │       │       │       └── service/
│   │       │       └── global/
│   │       │           ├── common/       # ApiResponse
│   │       │           ├── config/       # SecurityConfig
│   │       │           ├── entity/       # BaseTimeEntity
│   │       │           ├── error/        # BusinessException, GlobalExceptionHandler
│   │       │           ├── security/     # JwtTokenProvider, JwtAuthenticationFilter
│   │       │           └── util/         # FcmService
│   │       └── resources/
│   │           ├── application.yml
│   │           └── init.sql
│   ├── build.gradle
│   ├── settings.gradle
│   └── Dockerfile
├── frontend/
│   ├── App.tsx
│   ├── package.json
│   └── src/
│       ├── api/
│       │   └── client.ts               # Axios + JWT 자동갱신 인터셉터
│       ├── components/
│       │   └── common/
│       │       └── NoticeCard.tsx       # 공지 목록 아이템 컴포넌트
│       ├── navigation/
│       │   └── AppNavigator.tsx         # Auth Stack + Main Bottom Tabs
│       ├── screens/
│       │   ├── auth/
│       │   │   ├── LoginScreen.tsx
│       │   │   └── SignupScreen.tsx
│       │   ├── home/
│       │   │   └── HomeScreen.tsx       # 카테고리 탭 + 공지 목록
│       │   ├── notice/
│       │   │   └── NoticeDetailScreen.tsx  # WebView + 공유
│       │   ├── report/
│       │   │   └── ReportScreen.tsx     # AI 리포트
│       │   ├── search/
│       │   │   └── SearchScreen.tsx
│       │   ├── bookmark/
│       │   │   └── BookmarkScreen.tsx
│       │   └── settings/
│       │       └── SettingsScreen.tsx
│       ├── store/
│       │   └── authStore.ts            # Zustand 인증 스토어
│       ├── styles/
│       │   └── tokens.ts              # 디자인 토큰 (색상/타이포/간격)
│       └── types/
│           └── index.ts               # TypeScript 인터페이스
├── n8n-workflows/
│   ├── inu-general-crawl.json         # 전체 공지 크롤링 (source_id:1)
│   ├── inu-academic-crawl.json        # 학사 공지 크롤링 (source_id:2)
│   ├── inu-cse-crawl.json             # 컴공 공지 크롤링 (source_id:3)
│   ├── ops-health-check.json          # 5분 헬스체크 + 자동 재시작
│   ├── ops-daily-report.json          # 매일 09:00 운영 리포트
│   └── ops-crawl-monitor.json         # 3시간 크롤링 모니터
├── scripts/
│   ├── server-setup.sh                # EC2 Ubuntu 초기 설정
│   └── nginx-univ-notice.conf         # Nginx 리버스 프록시
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 4. ERD (11개 테이블)

```
universities (1) ──< departments (N)
universities (1) ──< notice_sources (N)
departments (1) ──< users (N)
notice_sources (1) ──< notices (N)
notice_sources (1) ──< crawl_logs (N)
users (1) ──< user_keywords (N)
users (1) ──< bookmarks (N)
users (1) ──< user_subscriptions (N)
users (1) ──< ai_reports (N)
notices (1) ──< bookmarks (N)
notices (1) ──< keyword_alerts (N)
user_keywords (1) ──< keyword_alerts (N)
```

### 테이블 상세

**universities**: university_id(PK), name, domain, created_at

**departments**: department_id(PK), university_id(FK), name, college, created_at

**users**: user_id(PK), email(UNIQUE), password_hash, nickname, department_id(FK), fcm_token, refresh_token, notification_enabled(default TRUE), created_at, updated_at

**notice_sources**: source_id(PK), university_id(FK), name, category(ENUM), base_url, list_url_template, llm_parse_prompt(TEXT), schedule, enabled(default TRUE), created_at, updated_at

**notices**: notice_id(PK), source_id(FK), external_id, title, url, category(ENUM), posted_date, url_hash(UNIQUE), created_at

**user_keywords**: keyword_id(PK), user_id(FK), keyword, alert_enabled(default TRUE), created_at

**keyword_alerts**: alert_id(PK), keyword_id(FK), notice_id(FK), is_sent(default FALSE), sent_at, created_at

**bookmarks**: bookmark_id(PK), user_id(FK), notice_id(FK), created_at, UNIQUE(user_id, notice_id)

**user_subscriptions**: subscription_id(PK), user_id(FK), source_id(FK), created_at, UNIQUE(user_id, source_id)

**ai_reports**: report_id(PK), user_id(FK), report_date, summary_content(TEXT), is_sent(default FALSE), created_at, UNIQUE(user_id, report_date)

**crawl_logs**: log_id(PK), source_id(FK), status(ENUM), notices_found, new_notices, error_message(TEXT), response_time_ms, executed_at

### ENUM 타입

```sql
CREATE TYPE notice_category AS ENUM ('ACADEMIC','SCHOLARSHIP','DEPARTMENT','CAREER','GENERAL','DORMITORY','EXTRACURRICULAR');
CREATE TYPE crawl_status AS ENUM ('SUCCESS','PARTIAL','FAILED');
```

### 주요 인덱스

- `idx_notices_title_gin`: notices.title GIN (제목 검색)
- `uq_notices_url_hash`: notices.url_hash UNIQUE (중복 방지)
- `idx_notices_posted_date`: notices.posted_date DESC (날짜순 정렬)
- `idx_ai_reports_user_date`: ai_reports(user_id, report_date DESC)

---

## 5. API 명세 (21개 엔드포인트)

### 인증 (Auth) — 인증 불필요

| 메서드 | URL | 설명 |
|--------|-----|------|
| POST | /api/v1/auth/signup | 회원가입 → {access_token, refresh_token} |
| POST | /api/v1/auth/login | 로그인 → {access_token, refresh_token} |
| POST | /api/v1/auth/refresh | 토큰 갱신 |
| POST | /api/v1/auth/logout | 로그아웃 (Bearer 필요) |

### 공지사항 (Notices) — Bearer 필요

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | /api/v1/notices?category=&page=&size= | 공지 목록 (카테고리 필터, 페이지네이션) |
| GET | /api/v1/notices/{id} | 공지 상세 |
| GET | /api/v1/notices/search?q=&category= | 공지 검색 |

### 키워드 (Keywords) — Bearer 필요

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | /api/v1/keywords | 내 키워드 목록 |
| POST | /api/v1/keywords | 키워드 등록 (최대 20개) |
| PATCH | /api/v1/keywords/{id} | 알림 ON/OFF |
| DELETE | /api/v1/keywords/{id} | 키워드 삭제 |

### 보관함 (Bookmarks) — Bearer 필요

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | /api/v1/bookmarks | 보관함 목록 |
| POST | /api/v1/bookmarks | 보관함 추가 |
| DELETE | /api/v1/bookmarks/{noticeId} | 보관함 제거 |

### AI 리포트 (Reports) — Bearer 필요

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | /api/v1/reports/today | 오늘의 리포트 |
| GET | /api/v1/reports/{id} | 리포트 상세 |
| GET | /api/v1/reports | 리포트 목록 |

### 설정 (Settings) — Bearer 필요

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | /api/v1/settings | 내 설정 조회 |
| PUT | /api/v1/settings | 설정 수정 |
| PUT | /api/v1/settings/fcm-token | FCM 토큰 업데이트 |

### 기초 데이터 (Meta) — 인증 불필요

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | /api/v1/universities | 대학교 목록 |
| GET | /api/v1/universities/{id}/departments | 학과 목록 |

### 내부 API (n8n → Spring Boot) — X-API-Key 헤더

| 메서드 | URL | 설명 |
|--------|-----|------|
| POST | /internal/v1/notices/batch | 크롤링된 공지 일괄 저장 |
| POST | /internal/v1/crawl-logs | 크롤링 로그 저장 |

### 공통 응답 형식

```json
{
  "success": true,
  "data": { ... },
  "error": { "code": "NOT_FOUND", "message": "..." },
  "meta": { "page": 0, "size": 20, "total": 150 }
}
```

---

## 6. 백엔드 파일별 역할 상세

### 6-1. global/ (공통 모듈)

| 파일 | 패키지 | 역할 |
|------|--------|------|
| ApiResponse.java | global.common | 공통 응답 래퍼. ok(), created(), error() 팩토리 메서드 |
| SecurityConfig.java | global.config | Spring Security: JWT 필터, 엔드포인트별 인증 규칙, BCryptPasswordEncoder |
| BaseTimeEntity.java | global.entity | @MappedSuperclass. createdAt, updatedAt 자동 감사 |
| BusinessException.java | global.error | 커스텀 예외. notFound(), conflict(), badRequest(), unauthorized() |
| GlobalExceptionHandler.java | global.error | @RestControllerAdvice. 예외→ApiResponse 변환 |
| JwtTokenProvider.java | global.security | JWT 생성(access/refresh), 검증, userId 추출. HMAC-SHA |
| JwtAuthenticationFilter.java | global.security | OncePerRequestFilter. Authorization 헤더에서 토큰 추출→SecurityContext 설정 |
| FcmService.java | global.util | @Scheduled(30초) 미발송 키워드 알림 처리. TODO: Firebase Admin SDK 실제 연동 |

### 6-2. domain/ (6개 도메인)

**notice 도메인 (핵심)**:
- Notice.java: 공지 Entity. urlHash로 중복 방지
- NoticeDto.java: Response(목록용) + BatchRequest(n8n 벌크 삽입용)
- NoticeRepository.java: 페이징 조회, LIKE 검색, urlHash 존재 체크, 날짜 범위 조회
- NoticeService.java: 목록/상세/검색 + saveBatch(n8n 데이터 수신 + 키워드 매칭)
- NoticeController.java: GET /notices, /notices/{id}, /notices/search
- InternalController.java: POST /internal/v1/notices/batch, /crawl-logs (X-API-Key 인증)

**user 도메인**:
- User.java: users 테이블 Entity. BaseTimeEntity 상속
- AuthDto.java: SignupRequest, LoginRequest, RefreshRequest, TokenResponse
- SettingsDto.java: Response, UpdateRequest, FcmTokenRequest
- UserRepository.java: findByEmail, existsByEmail, findByRefreshToken
- AuthService.java: signup(BCrypt), login, refresh(토큰 회전), logout
- AuthController.java: POST /auth/signup, /login, /refresh, /logout
- SettingsController.java: GET/PUT /settings, PUT /settings/fcm-token
- MetaController.java: GET /universities, /departments (JdbcTemplate 직접 사용)

**keyword 도메인**:
- UserKeyword.java, KeywordAlert.java: 키워드 + 매칭 알림 Entity
- KeywordService.java: CRUD + 최대 20개 제한 + 소유권 검증
- KeywordController.java: GET/POST/PATCH/DELETE /keywords

**bookmark 도메인**:
- Bookmark.java: (user_id, notice_id) UNIQUE 제약
- BookmarkService.java: 목록(Notice JOIN) + 추가(중복체크) + 삭제
- BookmarkController.java: GET/POST/DELETE /bookmarks

**report 도메인**:
- AiReport.java: (user_id, report_date) UNIQUE 제약
- ReportService.java: @Scheduled(cron="0 0 8 * * *") 매일 08:00 KST. Claude Haiku API 호출하여 전날 공지 요약. 폴백 요약 제공
- ReportController.java: GET /reports/today, /{id}, / (목록)

**crawl 도메인**:
- CrawlLog.java: status(SUCCESS/PARTIAL/FAILED), noticesFound, newNotices
- CrawlLogRepository.java: JpaRepository (InternalController에서 사용)

### 6-3. build.gradle 의존성

```
spring-boot-starter-web, data-jpa, data-redis, validation, actuator, security
postgresql (runtime)
jjwt-api 0.12.6, jjwt-impl, jjwt-jackson
springdoc-openapi-starter-webmvc-ui 2.6.0
lombok
```

### 6-4. application.yml 핵심 설정

- JPA: ddl-auto=validate, open-in-view=false
- JWT: secret, expiration(86400초=1일), refresh-expiration(604800초=7일)
- Internal API: api-key (환경변수 주입)
- LLM: api-key, model(claude-haiku-4-5-20251001)
- Actuator: health, info, metrics 노출

---

## 7. 프론트엔드 파일별 역할 상세

| 파일 | 역할 |
|------|------|
| tokens.ts | 디자인 토큰. colors(light/dark 17개+카테고리 5색), typography(9단계), spacing(8단계) |
| index.ts (types) | API 응답 인터페이스: Notice, TokenResponse, UserKeyword, AiReport, Department |
| client.ts | Axios 인스턴스 + JWT 자동갱신 인터셉터. authApi, noticeApi, bookmarkApi, keywordApi, reportApi, metaApi 모듈 |
| authStore.ts | Zustand: login, signup, logout, restoreSession. AsyncStorage에 토큰 저장 |
| AppNavigator.tsx | isAuthenticated 분기: Auth Stack(Login/Signup) vs Main Tabs(Home/Report/Search/Bookmark/Settings) + NoticeDetail 모달 |
| NoticeCard.tsx | 공용 컴포넌트: 카테고리 뱃지(색상), 제목(2줄), 날짜, 북마크 토글 |
| HomeScreen.tsx | 카테고리 탭(전체/학사/장학/학과/취업) + FlatList + Pull-to-Refresh |
| NoticeDetailScreen.tsx | WebView(원본 URL) + React Native Share API |
| ReportScreen.tsx | 오늘의 리포트 카드 + 지난 리포트 목록 |
| SearchScreen.tsx | TextInput → noticeApi.search() → FlatList |
| BookmarkScreen.tsx | 저장된 공지 목록 + 삭제 |
| SettingsScreen.tsx | 메뉴(키워드관리/알림/소스/앱정보) + 로그아웃 |
| LoginScreen.tsx | 이메일+비밀번호 + KeyboardAvoidingView |
| SignupScreen.tsx | 이메일+비밀번호+닉네임+학과선택(가로 스크롤 칩) |

---

## 8. n8n 크롤링 워크플로우

### 크롤링 워크플로우 패턴 (3개 모두 동일)

```
[Cron 트리거 매시간]
  → [HTTP Request] 대학교 공지 페이지 GET
    → [LLM 노드] HTML → JSON 파싱 (Claude Haiku)
      프롬프트: "아래 HTML에서 공지사항 목록을 추출하여
      {source_id, external_id, title, url, category, posted_date} JSON 배열로 반환하라"
    → [Code 노드] LLM 출력에서 JSON 배열 추출 + 유효성 검증
    → [If 노드] 공지 0건이면 실패 로그, 1건+이면 저장
    → [HTTP Request] POST http://api:8080/internal/v1/notices/batch
    → [HTTP Request] POST http://api:8080/internal/v1/crawl-logs
```

### 소스별 차이

| 파일 | source_id | category | URL |
|------|-----------|----------|-----|
| inu-general-crawl.json | 1 | GENERAL | https://www.inu.ac.kr/inu/1534/subview.do |
| inu-academic-crawl.json | 2 | ACADEMIC | https://www.inu.ac.kr/inu/1516/subview.do |
| inu-cse-crawl.json | 3 | DEPARTMENT | https://cse.inu.ac.kr/isis/3519/subview.do |

### 운영 워크플로우

| 파일 | 스케줄 | 기능 |
|------|--------|------|
| ops-health-check.json | 5분 | API 헬스체크 → 실패 시 컨테이너 자동 재시작 |
| ops-daily-report.json | 매일 09:00 | 운영 현황 요약 리포트 |
| ops-crawl-monitor.json | 3시간 | 크롤링 성공률 감시 → 2개+ 실패 시 알림 |

---

## 9. Docker Compose 구성

```yaml
services:
  api:        # Spring Boot :8080 — depends_on: postgresql(healthy), redis(healthy)
  postgresql: # PostgreSQL 16 :5432 — init.sql 자동 실행
  redis:      # Redis 7 :6379
  n8n:        # n8n :5678 — depends_on: api(healthy)
```

---

## 10. 환경변수 (.env)

```
DB_USER=univnotice
DB_PASSWORD=
JWT_SECRET=                    # 256비트 이상
JWT_EXPIRATION=86400
LLM_API_KEY=                   # Claude API 키
INTERNAL_API_KEY=              # n8n→Spring Boot 인증 키
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=
FCM_CREDENTIALS_PATH=./firebase-credentials.json
```

---

## 11. Spring Security 허용 규칙

```
permitAll: /api/v1/auth/**, /api/v1/universities/**, /internal/**, /actuator/**, /swagger-ui/**, /v3/api-docs/**
authenticated: 그 외 모든 요청
```

---

## 12. 핵심 비즈니스 로직

### 12-1. 공지 배치 저장 + 키워드 매칭 (NoticeService.saveBatch)

1. n8n이 POST /internal/v1/notices/batch로 JSON 배열 전송
2. 각 공지의 URL을 SHA-256 해시하여 url_hash 생성
3. url_hash로 중복 체크 → 이미 있으면 skip
4. 새 공지만 DB에 저장
5. 저장된 새 공지들에 대해 alert_enabled=true인 모든 키워드와 매칭
6. 매칭된 키워드가 있으면 keyword_alerts 테이블에 기록

### 12-2. FCM 푸시 발송 (FcmService)

1. 30초마다 keyword_alerts에서 is_sent=false인 레코드 조회
2. 각 알림의 keyword → user → fcm_token 추적
3. FCM 푸시 발송 (현재는 로그만, TODO: Firebase Admin SDK)
4. 발송 완료 후 is_sent=true, sent_at 업데이트

### 12-3. AI 리포트 생성 (ReportService)

1. 매일 08:00 KST @Scheduled 실행
2. 전날(yesterday) 공지 조회
3. notification_enabled=true인 사용자 목록 조회
4. 사용자별로 이미 오늘 리포트가 있으면 skip
5. 공지 목록을 Claude Haiku API에 전달하여 요약 요청
6. 결과를 ai_reports에 저장
7. API 실패 시 폴백 요약 (원문 목록)

---

## 13. Claude Code가 수행할 작업 순서

### STEP 1: 백엔드 초기화
1. `backend/` 폴더에 Spring Boot 프로젝트 구조 확인/생성
2. `build.gradle`, `settings.gradle` 작성
3. `Dockerfile` 작성
4. `src/main/resources/application.yml` 작성
5. `src/main/resources/init.sql` 작성 (db/ 하위 폴더 없이 resources/ 직접)

### STEP 2: global/ 모듈 작성
1. `global/entity/BaseTimeEntity.java`
2. `global/common/ApiResponse.java`
3. `global/error/BusinessException.java` + `GlobalExceptionHandler.java`
4. `global/security/JwtTokenProvider.java` + `JwtAuthenticationFilter.java`
5. `global/config/SecurityConfig.java`
6. `global/util/FcmService.java`

### STEP 3: domain/ 모듈 작성 (도메인별 순서)
1. notice: Entity → Repository → DTO → Service → Controller + InternalController
2. user: Entity → Repository → DTO → Service → AuthController + SettingsController + MetaController
3. keyword: Entity(2개) → Repository(2개) → Service → Controller
4. bookmark: Entity → Repository → Service → Controller
5. report: Entity → Repository → Service(@Scheduled) → Controller
6. crawl: Entity → Repository

### STEP 4: 인프라 파일 작성
1. `docker-compose.yml`
2. `.env.example`
3. `.gitignore`
4. `.github/workflows/pr-check.yml`
5. `.github/workflows/deploy.yml`
6. `scripts/server-setup.sh`
7. `scripts/nginx-univ-notice.conf`
8. `README.md`

### STEP 5: 프론트엔드 작성
1. `package.json`
2. `src/styles/tokens.ts`
3. `src/types/index.ts`
4. `src/api/client.ts`
5. `src/store/authStore.ts`
6. `src/navigation/AppNavigator.tsx`
7. `src/components/common/NoticeCard.tsx`
8. 8개 화면 순서대로

### STEP 6: n8n 워크플로우 JSON 작성
1. 크롤링 3개 + 운영 3개

---

## 14. 사람이 직접 해야 하는 작업

Claude Code가 100% 자동으로 수행할 수 없는 작업:

### 반드시 사람이 해야 하는 것

1. **`.env` 파일 생성**: `.env.example`을 복사하여 실제 비밀번호/API 키 입력. 보안 정보는 사람만 알고 있음.

2. **`docker-compose up -d` 실행**: 터미널에서 직접 실행하여 4개 서비스 구동 확인.

3. **n8n UI에서 워크플로우 임포트**: `http://localhost:5678` 접속 → Settings → Import → JSON 파일 6개 업로드 → Activate. n8n은 웹 UI를 통해서만 워크플로우를 임포트할 수 있음.

4. **n8n에 Anthropic API Credential 등록**: n8n UI → Settings → Credentials → Anthropic API 추가 → API 키 입력. 이것도 웹 UI에서만 가능.

5. **LLM 파싱 프롬프트 미세 조정**: 실제 인천대 HTML로 크롤링 테스트 후, 파싱이 안 되면 n8n UI에서 프롬프트 수정. 실제 HTML 구조를 보면서 사람이 판단해야 함.

6. **Firebase 프로젝트 생성**: Firebase Console에서 프로젝트 생성 → 인증서(JSON) 다운로드 → 프로젝트 루트에 배치. Google 계정 인증이 필요.

7. **AWS EC2 배포**: AWS 콘솔에서 인스턴스 생성, SSH 접속, `server-setup.sh` 실행. AWS 계정/결제 정보 필요.

8. **Apple Developer / Google Play 등록**: 앱스토어 배포를 위한 개발자 계정 등록. 본인 인증 + 결제 필요.

9. **React Native 빌드**: `npx react-native run-ios` 또는 `run-android` 실행. Xcode/Android Studio 환경이 로컬에 설치되어 있어야 함.

### Claude Code가 할 수 있지만 사람 확인이 필요한 것

1. **빌드 에러 수정**: `docker-compose up` 또는 `./gradlew build` 시 에러가 나면 Claude Code가 수정 가능. 단, 에러 메시지를 붙여넣어줘야 함.

2. **Swagger UI에서 API 테스트**: Claude Code가 curl로 테스트할 수 있지만, Swagger UI에서 시각적으로 확인하는 것은 사람이 직접.

3. **프론트엔드 UI 확인**: 화면이 의도대로 렌더링되는지는 사람이 시뮬레이터/기기에서 직접 확인.

---

## 15. init.sql 초기 데이터

인천대학교 1개 대학, 17개 학과, 3개 크롤링 소스가 시드 데이터로 포함.

```sql
INSERT INTO universities (name, domain) VALUES ('인천대학교', 'inu.ac.kr');

-- 17개 학과 (컴퓨터공학부, 정보통신공학과, 임베디드시스템공학과, 경영학부, 경제학과, ...)

-- 3개 크롤링 소스
INSERT INTO notice_sources (university_id, name, category, base_url, list_url_template, llm_parse_prompt) VALUES
(1, '전체 공지', 'GENERAL', 'https://www.inu.ac.kr', 'https://www.inu.ac.kr/inu/1534/subview.do', '...'),
(1, '학사 공지', 'ACADEMIC', 'https://www.inu.ac.kr', 'https://www.inu.ac.kr/inu/1516/subview.do', '...'),
(1, '컴퓨터공학부 공지', 'DEPARTMENT', 'https://cse.inu.ac.kr', 'https://cse.inu.ac.kr/isis/3519/subview.do', '...');
```