# 대학교 통합 공지사항 앱 서비스

인천대학교의 모든 공지사항을 하나의 앱에서 통합 열람하고, AI가 매일 아침 요약 리포트를 제공하는 서비스입니다.

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 백엔드 | Java 17 / Spring Boot 3.3 |
| 프론트엔드 | React Native / TypeScript |
| 크롤링 | n8n + LLM (HTML→JSON 파싱) |
| 데이터베이스 | PostgreSQL 16 |
| 캐시 | Redis 7 |
| 푸시 알림 | Firebase Cloud Messaging |
| AI 리포트 | Claude Haiku API |
| CI/CD | GitHub Actions |
| 컨테이너 | Docker / Docker Compose |

## 로컬 개발 환경 실행

```bash
# 1. 환경변수 설정
cp .env.example .env
# .env 파일에 실제 값 입력

# 2. Docker Compose 실행
docker-compose up -d

# 3. 서비스 접속
# Spring Boot API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
# n8n: http://localhost:5678
```

## 프로젝트 구조

```
project/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/univnotice/api/
│   │   ├── config/             # Security, Redis 설정
│   │   ├── domain/
│   │   │   ├── notice/         # 공지사항 (Entity, Repo, Service, Controller)
│   │   │   ├── user/           # 사용자/인증
│   │   │   ├── keyword/        # 키워드 알림
│   │   │   ├── bookmark/       # 보관함
│   │   │   ├── report/         # AI 리포트
│   │   │   └── crawl/          # 크롤링 로그
│   │   └── global/             # 공통 (Auth, Error, Response)
│   └── src/main/resources/
│       ├── application.yml
│       └── db/init.sql         # DDL + 초기 데이터
├── n8n-workflows/              # n8n 크롤링 워크플로우 JSON
├── .github/workflows/          # CI/CD
├── docker-compose.yml
└── .env.example
```

## API 엔드포인트

| 그룹 | 메서드 | URL | 설명 |
|------|--------|-----|------|
| 인증 | POST | /api/v1/auth/signup | 회원가입 |
| 인증 | POST | /api/v1/auth/login | 로그인 |
| 인증 | POST | /api/v1/auth/refresh | 토큰 갱신 |
| 공지 | GET | /api/v1/notices | 공지 목록 |
| 공지 | GET | /api/v1/notices/{id} | 공지 상세 |
| 공지 | GET | /api/v1/notices/search?q= | 공지 검색 |
| 키워드 | GET/POST/PATCH/DELETE | /api/v1/keywords | 키워드 CRUD |
| 보관함 | GET/POST/DELETE | /api/v1/bookmarks | 보관함 CRUD |
| 리포트 | GET | /api/v1/reports/today | 오늘의 AI 리포트 |
| 내부 | POST | /internal/v1/notices/batch | n8n→공지 저장 |