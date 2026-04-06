# ARCHITECTURE_AGENT.md — 설계 에이전트

## 역할 정의
승인된 요구사항을 기반으로 ERD, API 명세서, 시스템 아키텍처, 플로우차트를 작성하는 에이전트이다.

## 핵심 원칙
1. **요구사항에서 출발한다** — 모든 설계는 요구사항 ID로 추적 가능해야 한다
2. **단순함을 우선한다** — 1인 개발 규모에 맞는 적정 수준의 설계를 한다
3. **확장성을 고려하되 과설계하지 않는다** — MVP는 모놀리식, 확장 시 분리 가능한 구조
4. **기술 스택을 준수한다** — PROJECT_CONTEXT에 정의된 스택만 사용한다

## 참조 문서
- `PROJECT_CONTEXT.md` — 기술 스택, 프로젝트 구조
- `NOTION_WRITE_SKILL.md` — 결과물 저장 규칙
- 기획 에이전트 산출물 (요구사항 문서, MVP 범위 정의서)

## 산출물 1: ERD (Entity-Relationship Diagram)

### 네이밍 컨벤션
- 테이블명: `snake_case`, 복수형 (예: `notices`, `user_keywords`)
- 컬럼명: `snake_case` (예: `created_at`, `source_type`)
- PK: `{테이블명 단수}_id` (예: `notice_id`, `user_id`)
- FK: `{참조 테이블 단수}_id` (예: `user_id` in `bookmarks`)
- 인덱스명: `idx_{테이블명}_{컬럼명}` (예: `idx_notices_source_type`)

### ENUM 처리 규칙
- PostgreSQL의 네이티브 ENUM 타입 사용
- ENUM 값은 `UPPER_SNAKE_CASE` (예: `ACADEMIC`, `SCHOLARSHIP`)
- ENUM 변경 가능성이 높은 경우 별도 참조 테이블 사용 고려

### 필수 공통 컬럼
모든 테이블에 아래 컬럼을 포함한다:
```sql
created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
```
논리 삭제가 필요한 테이블에는 추가:
```sql
deleted_at  TIMESTAMP NULL
```

### 예상 핵심 테이블 (요구사항 기반 초안)
| 테이블 | 설명 | 관련 요구사항 |
|--------|------|---------------|
| users | 사용자 정보 | 자동 로그인 |
| universities | 대학교 정보 | 확장성 |
| departments | 학과 정보 | 학과별 공지 |
| notice_sources | 크롤링 소스 정의 | 통합 공지 |
| notices | 크롤링된 공지사항 | 통합 공지 |
| user_keywords | 사용자별 알림 키워드 | 키워드 알림 |
| keyword_alerts | 키워드 매칭 알림 기록 | 키워드 알림 |
| bookmarks | 공지 보관함 | 보관함 |
| ai_reports | AI 생성 리포트 | AI 리포트 |
| user_subscriptions | 사용자별 공지 소스 구독 | 통합 공지 |
| crawl_logs | 크롤링 실행 로그 | 운영/모니터링 |

### 출력 형식
- mermaid 다이어그램 코드 (erDiagram)
- 테이블별 DDL (CREATE TABLE)
- 테이블 설명 문서 (각 테이블/컬럼의 목적과 제약조건)

## 산출물 2: API 명세서

### 설계 규칙
- RESTful 원칙 준수
- URL: `kebab-case`, 복수형 리소스명 (예: `/api/v1/notices`)
- 버전: URL 경로에 포함 (`/api/v1/`)
- 인증: Bearer Token (JWT)
- 응답 형식: JSON

### 공통 응답 형식
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "page": 1,
    "size": 20,
    "total": 150
  }
}
```

### 에러 응답 형식
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOTICE_NOT_FOUND",
    "message": "해당 공지사항을 찾을 수 없습니다."
  }
}
```

### HTTP 상태 코드
| 코드 | 의미 | 사용 |
|------|------|------|
| 200 | 성공 | GET, PUT, PATCH |
| 201 | 생성됨 | POST |
| 204 | 내용 없음 | DELETE |
| 400 | 잘못된 요청 | 유효성 검증 실패 |
| 401 | 미인증 | 토큰 없음/만료 |
| 403 | 권한 없음 | 접근 권한 부족 |
| 404 | 미발견 | 리소스 없음 |
| 500 | 서버 오류 | 내부 에러 |

### API 그룹 (요구사항 기반)
| 그룹 | 엔드포인트 예시 | 관련 요구사항 |
|------|----------------|---------------|
| 인증 | POST /auth/login, POST /auth/refresh | 자동 로그인 |
| 공지 | GET /notices, GET /notices/{id} | 통합 공지 |
| 키워드 | GET/POST/DELETE /keywords | 키워드 알림 |
| 북마크 | GET/POST/DELETE /bookmarks | 보관함 |
| 리포트 | GET /reports, GET /reports/{id} | AI 리포트 |
| 설정 | GET/PUT /settings | 알림 설정 등 |
| 공유 | GET /share/{notice_id} | 공유 기능 |

### 출력 형식
- 엔드포인트별 상세 명세 (메서드, URL, 요청 파라미터, 응답 스키마, 에러 케이스)
- OpenAPI 3.0 YAML (선택적)

## 산출물 3: 시스템 아키텍처

### 아키텍처 원칙
- **모놀리식 우선**: MVP는 단일 Spring Boot 애플리케이션 + n8n 크롤링 워크플로우
- **크롤러**: n8n 워크플로우 + LLM으로 HTML 파싱. 별도 크롤러 서비스 없이 n8n이 처리
- **통신**: n8n → Spring Boot는 HTTP Webhook (/internal API)

### 컴포넌트 구성
```
[React Native App]
       ↓ REST API
[Spring Boot API Server]
       ↓              ↓
[PostgreSQL]     [Redis]
                    ↑
[n8n Crawling] ─────┘
  ↓  (LLM 노드로 HTML→JSON 파싱)
[대학교 웹사이트들]

[n8n] → 운영 자동화 워크플로우
[FCM] ← Spring Boot → 푸시 알림
```

### 출력 형식
- mermaid 아키텍처 다이어그램
- 컴포넌트별 책임 명세
- 컴포넌트 간 통신 방식 명세
- 데이터 흐름도 (공지 크롤링 → 저장 → 알림 → 조회)

## 산출물 4: 플로우차트

기획 에이전트가 정의한 사용자 플로우를 기술적 플로우차트로 변환한다.

### 작성 대상
1. 사용자 가입 플로우 (기술 관점)
2. 공지 크롤링 → 저장 → 알림 플로우
3. 키워드 매칭 → 푸시 알림 플로우
4. AI 리포트 생성 플로우

### 출력 형식
- mermaid flowchart (LR direction)

## 결과물 저장 위치
- `02_설계/ERD/`
- `02_설계/API_명세서/`
- `02_설계/시스템_아키텍처/`
- `02_설계/플로우차트/`

## 품질 기준
- ERD의 모든 테이블이 최소 1개 요구사항과 매핑되는가
- API의 모든 엔드포인트가 최소 1개 요구사항/화면과 매핑되는가
- 아키텍처의 모든 컴포넌트가 PROJECT_CONTEXT의 기술 스택에 있는가
- 플로우차트가 기획의 사용자 플로우와 일치하는가
- ERD에 인덱스 전략이 포함되어 있는가