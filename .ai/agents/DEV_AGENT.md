# DEV_AGENT.md — 개발 에이전트

## 역할 정의
승인된 설계(ERD, API 명세, 아키텍처)와 디자인(Figma 프로토타입)을 기반으로 백엔드, 프론트엔드, 크롤러 코드를 작성하는 에이전트이다.

## 핵심 원칙
1. **설계 문서를 정확히 따른다** — 임의로 구조를 변경하지 않는다
2. **컨벤션을 엄격히 지킨다** — 이 문서에 정의된 코드 스타일을 준수한다
3. **테스트를 함께 작성한다** — 핵심 비즈니스 로직에는 반드시 단위 테스트를 작성한다
4. **점진적으로 구현한다** — 전체를 한 번에 만들지 않고, 기능 단위로 구현-테스트-커밋한다

## 참조 문서
- `PROJECT_CONTEXT.md` — 기술 스택
- `NOTION_WRITE_SKILL.md` — 기술 의사결정 로그 저장
- `CRAWLING_RESILIENCE_SKILL.md` — 크롤러 구현 시 참조
- 설계 에이전트 산출물 (ERD, API 명세, 아키텍처)
- 디자인 에이전트 산출물 (Figma 파일, 디자인 시스템)

## 1. 백엔드 (Spring Boot)

### 프로젝트 구조
```
com.univnotice.api/
├── config/           # 설정 (Security, Redis, CORS, Swagger)
├── domain/
│   ├── notice/       # 공지사항 도메인
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   └── dto/
│   ├── user/         # 사용자 도메인
│   ├── keyword/      # 키워드 알림 도메인
│   ├── bookmark/     # 보관함 도메인
│   ├── report/       # AI 리포트 도메인
│   └── crawl/        # 크롤링 관리 도메인
├── global/
│   ├── auth/         # 인증/인가 (JWT)
│   ├── error/        # 전역 예외 처리
│   ├── response/     # 공통 응답 형식
│   └── util/         # 유틸리티
└── infra/
    ├── fcm/          # Firebase Cloud Messaging
    ├── redis/        # Redis 연동
    └── external/     # 크롤러 API 호출
```

### 코드 컨벤션

**네이밍**:
- 클래스명: `PascalCase` (예: `NoticeService`, `UserController`)
- 메서드명: `camelCase` (예: `findNoticeById`, `createBookmark`)
- 변수명: `camelCase`
- 상수: `UPPER_SNAKE_CASE`
- 패키지명: `lowercase`

**레이어별 규칙**:
| 레이어 | 접미사 | 책임 |
|--------|--------|------|
| Controller | `Controller` | HTTP 요청/응답 처리, 유효성 검증 위임 |
| Service | `Service` | 비즈니스 로직, 트랜잭션 관리 |
| Repository | `Repository` | 데이터 접근 (Spring Data JPA) |
| Entity | (없음) | DB 테이블 매핑 |
| DTO | `Request`, `Response` | 데이터 전송 객체 |

**Entity 규칙**:
- `@Entity` + `@Table(name = "...")` 명시
- Lombok `@Getter`, `@NoArgsConstructor(access = PROTECTED)` 사용
- `@Builder`는 생성 메서드에만 사용
- 양방향 연관관계 지양, 불가피 시 `@JsonIgnore` 또는 DTO 변환
- `BaseTimeEntity` 상속 (createdAt, updatedAt 자동 관리)

**서비스 규칙**:
- `@Transactional(readOnly = true)` 기본, 쓰기 메서드만 `@Transactional`
- 비즈니스 예외는 커스텀 예외 클래스 사용 (예: `NoticeNotFoundException`)
- 외부 API 호출 시 타임아웃 설정 필수

**컨트롤러 규칙**:
- `@RestController` + `@RequestMapping("/api/v1/...")`
- 요청 DTO에 `@Valid` 사용
- Swagger `@Operation`, `@ApiResponse` 어노테이션 작성

### Git 컨벤션
- 브랜치: `feature/{기능명}`, `fix/{이슈}`, `refactor/{대상}`
- 커밋 메시지: `type: 한글 설명`
    - type: feat, fix, refactor, test, docs, chore
    - 예: `feat: 공지사항 목록 조회 API 구현`
- PR 단위: 기능 1개 = PR 1개

## 2. 프론트엔드 (React Native)

### 프로젝트 구조
```
src/
├── api/              # API 호출 함수 (axios/fetch)
├── assets/           # 이미지, 폰트
├── components/       # 공용 컴포넌트
│   ├── common/       # Button, Input, Card 등
│   └── layout/       # Header, BottomNav, SafeArea
├── hooks/            # 커스텀 훅
├── navigation/       # React Navigation 설정
├── screens/          # 화면별 컴포넌트
│   ├── auth/
│   ├── home/
│   ├── notice/
│   ├── report/
│   ├── bookmark/
│   └── settings/
├── store/            # 상태 관리 (Zustand 또는 Context)
├── styles/           # 디자인 토큰 (colors, typography, spacing)
├── types/            # TypeScript 타입 정의
└── utils/            # 유틸리티 함수
```

### 코드 컨벤션
- 함수형 컴포넌트 + TypeScript 필수
- 스타일: StyleSheet.create 또는 Styled Components
- 상태 관리: Zustand (간단) 또는 React Query (서버 상태)
- 네비게이션: React Navigation v6+
- 디자인 토큰은 `styles/` 디렉토리에서 중앙 관리
- API 호출은 `api/` 디렉토리의 함수를 통해서만 수행

### Figma → 코드 변환 절차
1. Figma MCP로 디자인 컨텍스트 추출
2. 디자인 시스템 토큰을 `styles/` 파일에 매핑
3. 화면별 컴포넌트 구현
4. API 명세 기반 데이터 바인딩
5. 인터랙션/네비게이션 연결

## 3. 크롤러 (n8n + LLM 워크플로우)

### n8n 크롤링 워크플로우 구조
FastAPI 별도 서비스 대신, n8n 워크플로우에서 크롤링 전체를 처리한다.
LLM이 HTML을 파싱하므로 CSS 셀렉터 하드코딩이 불필요하다.

### 워크플로우 구성 (소스당 1개 워크플로우)

```
[Cron 트리거] (매 1시간)
  → [HTTP Request] 대학교 공지 페이지 GET
    → [LLM 노드] HTML → JSON 파싱
       프롬프트: "아래 HTML에서 공지사항 목록을 추출하여
       {title, date, url, id} JSON 배열로 반환하라"
    → [HTTP Request] Spring Boot /internal/v1/notices/batch POST
    → [HTTP Request] Spring Boot /internal/v1/crawl-logs POST
```

### 에러 핸들링 (n8n 노드 구성)
- HTTP Request 실패 → n8n Error Trigger → Retry (최대 3회, 30초 간격)
- LLM 파싱 실패 → n8n Error Trigger → 사람에게 Slack/이메일 알림
- 3회 연속 실패 → 해당 소스 비활성화 + 사람에게 에스컬레이션

### 크롤링 소스 관리
- 각 소스는 별도의 n8n 워크플로우로 관리한다
- 소스 추가 시 기존 워크플로우를 복제하여 URL만 변경하면 된다
- LLM이 HTML을 이해하므로 소스별 파서 코드 작성이 불필요하다

### n8n + LLM 크롤링의 장점
1. CSS 셀렉터 유지보수 불필요 → 학교 웹사이트 구조 변경에 자동 대응
2. 소스별 파서 코드 없이 프롬프트만으로 다양한 페이지 크롤링 가능
3. n8n의 시각적 워크플로우로 비개발자도 소스 추가/수정 가능
4. 크롤링 + 운영 자동화를 하나의 플랫폼(n8n)에서 통합 관리

### LLM 파싱 프롬프트 템플릿
```
당신은 HTML에서 공지사항 정보를 추출하는 파서입니다.
아래 HTML에서 공지사항 목록을 찾아 아래 JSON 형식으로 추출하세요.

출력 형식 (JSON 배열만 반환, 다른 텍스트 없이):
[
  {
    "external_id": "게시글 번호",
    "title": "공지 제목",
    "posted_date": "YYYY-MM-DD",
    "url": "공지 상세 페이지 전체 URL"
  }
]

HTML:
{{$node["HTTP Request"].json.data}}
```

## 구현 순서

### Phase 3 권장 구현 순서
```
1. 인프라 세팅 (Docker Compose: PostgreSQL, Redis, n8n, Spring Boot)
2. 백엔드 프로젝트 초기화 (Spring Boot Starter)
3. Entity + Repository 구현 (ERD 기반)
4. 공통 모듈 (인증, 예외처리, 응답형식)
5. 공지사항 API (CRUD + 목록/검색)
6. 내부 API 구현 (/internal/v1/notices/batch, /internal/v1/crawl-logs)
7. n8n 크롤링 워크플로우 구성 (소스 3개)
8. n8n → Spring Boot 연동 테스트
9. 사용자/인증 API
10. 키워드 알림 API + FCM 연동
11. 보관함 API
12. AI 리포트 API
13. 프론트엔드 프로젝트 초기화 (React Native)
14. 공용 컴포넌트 구현 (디자인 시스템)
15. 화면별 구현 (온보딩 → 메인 → 공지 → 리포트 → 보관함 → 설정)
16. 프론트↔백엔드 API 연동
17. 통합 테스트
```

## 결과물 저장 위치
- 코드: Git 레포지토리 (GitHub)
- 기술 의사결정 로그: Notion `04_개발/기술_의사결정_로그/`
- 컨벤션 문서: Notion `04_개발/컨벤션/`

## 품질 기준
- 모든 API 엔드포인트가 명세대로 동작하는가
- 핵심 서비스 메서드에 단위 테스트가 있는가
- ERD의 모든 테이블에 대응하는 Entity가 있는가
- 프론트엔드의 모든 화면이 디자인과 일치하는가
- 크롤러가 최소 3개 소스에서 정상 동작하는가 (n8n 워크플로우)
- Docker Compose로 Spring Boot + PostgreSQL + Redis + n8n이 한 번에 구동되는가