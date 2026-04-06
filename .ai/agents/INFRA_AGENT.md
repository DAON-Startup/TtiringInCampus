# INFRA_AGENT.md — 인프라/배포 에이전트

## 역할 정의
Docker 환경 구성, CI/CD 파이프라인, AWS 배포, 모니터링 설정을 자동화하는 에이전트이다.

## 핵심 원칙
1. **로컬 개발환경부터 확보한다** — Docker Compose로 원커맨드 실행
2. **비용 최소화** — 1인 개발 프로젝트에 맞는 최소 인프라
3. **자동화 우선** — 수동 배포 절차를 최소화한다
4. **보안 기본** — 환경변수 관리, HTTPS, 방화벽 설정

## 참조 문서
- `PROJECT_CONTEXT.md` — 기술 스택, 비용 기준
- `NOTION_WRITE_SKILL.md` — 문서 저장
- 설계 에이전트 산출물 (시스템 아키텍처)

## 산출물 1: Docker Compose (로컬 개발환경)

```yaml
# 구성 컴포넌트:
# 1. spring-boot-api (백엔드)
# 2. n8n (크롤링 엔진 + 운영 자동화)
# 3. postgresql (DB)
# 4. redis (캐시/세션)
```

### 필수 설정 항목
| 항목 | 설정 |
|------|------|
| PostgreSQL 버전 | 16 + pgvector 확장 |
| Redis 버전 | 7 |
| 네트워크 | 단일 Docker 네트워크 (`univ-notice-net`) |
| 볼륨 | PostgreSQL 데이터, Redis 데이터 영속화 |
| 환경변수 | `.env` 파일로 외부화 (Git 제외) |
| 포트 매핑 | API: 8080, n8n: 5678, DB: 5432, Redis: 6379 |
| 헬스체크 | 각 서비스별 헬스체크 설정 |
| 의존성 | API → DB, Redis / n8n → API (Webhook) |

### .env.example 제공 항목
```
# Database
DB_HOST=postgresql
DB_PORT=5432
DB_NAME=univ_notice
DB_USER=
DB_PASSWORD=

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=
JWT_EXPIRATION=86400

# FCM
FCM_CREDENTIALS_PATH=

# LLM API (AI 리포트용)
LLM_API_KEY=
LLM_MODEL=

# n8n
N8N_BASIC_AUTH_USER=
N8N_BASIC_AUTH_PASSWORD=
N8N_SECURE_COOKIE=false
N8N_PORT=5678

# Crawler (n8n에서 사용)
CRAWLER_RATE_LIMIT_MS=2000
CRAWLER_MAX_RETRIES=3
```

## 산출물 2: CI/CD 파이프라인 (GitHub Actions)

### 파이프라인 구성

**PR 체크 (`.github/workflows/pr-check.yml`)**:
```
트리거: PR 생성/업데이트
1. 코드 체크아웃
2. Java 17 설정
3. Gradle 빌드 + 단위 테스트
4. (프론트엔드) Node.js 설정 + ESLint + TypeScript 체크
5. n8n 워크플로우 JSON 유효성 검증 (선택적)
6. 결과 코멘트
```

**배포 (`.github/workflows/deploy.yml`)**:
```
트리거: main 브랜치 푸시 (수동 승인 후)
1. 코드 체크아웃
2. Docker 이미지 빌드 (멀티 스테이지)
3. ECR에 이미지 푸시
4. ECS 서비스 업데이트 (또는 EC2 docker-compose pull)
5. 헬스체크 확인
6. 실패 시 자동 롤백
```

## 산출물 3: AWS 인프라 구성

### MVP 최소 구성 (비용 최적화)

| 서비스 | 인스턴스/설정 | 예상 월 비용 |
|--------|---------------|-------------|
| EC2 | t3.small (2vCPU, 2GB) | ~$15 |
| RDS PostgreSQL | db.t3.micro (Free Tier) | $0~15 |
| ElastiCache Redis | cache.t3.micro (Free Tier) | $0~13 |
| ECR | 이미지 저장 | ~$1 |
| Route 53 | 도메인 | ~$0.50 |
| ACM | SSL 인증서 | 무료 |
| CloudWatch | 기본 모니터링 | 무료 |

**Free Tier 활용 전략**: 최초 12개월은 RDS/ElastiCache Free Tier 적극 활용

### 대안: 단일 EC2에 Docker Compose
비용을 더 줄이려면 단일 EC2 t3.small에 Docker Compose로 모든 서비스를 구동할 수 있다. MVP 단계에서 권장.

### 보안 설정
| 항목 | 설정 |
|------|------|
| Security Group | API: 80/443만 공개, DB/Redis: 내부만 |
| IAM | 최소 권한 원칙, 서비스별 IAM Role |
| 환경변수 | AWS Secrets Manager 또는 Parameter Store |
| HTTPS | ACM + ALB 또는 Let's Encrypt (단일 EC2) |
| SSH | 키 페어 접근, 포트 변경 권장 |

## 산출물 4: 모니터링 설정

### 기본 모니터링 (CloudWatch)
| 메트릭 | 임계값 | 알림 |
|--------|--------|------|
| CPU 사용률 | > 80% (5분간) | 이메일/Slack |
| 메모리 사용률 | > 85% | 이메일/Slack |
| 디스크 사용률 | > 80% | 이메일/Slack |
| 5xx 에러 수 | > 10/분 | 즉시 알림 |
| API 응답 시간 | p95 > 2초 | 이메일 |

### 앱 레벨 모니터링
- Spring Boot Actuator (`/actuator/health`, `/actuator/metrics`)
- 크롤러 헬스 엔드포인트 (`/health`)
- 커스텀 메트릭: 크롤링 성공률, 공지 감지 수, 알림 발송 수

### n8n 운영 워크플로우 (Phase 4 활성화)
| 워크플로우 | 트리거 | 액션 |
|------------|--------|------|
| 크롤링 모니터링 | 매시간 | Crawler `/health` 호출 → 실패 시 알림 |
| 일일 운영 리포트 | 매일 09:00 | DB에서 메트릭 수집 → Notion에 리포트 저장 |
| 장애 알림 | CloudWatch 알림 수신 | Slack/카카오톡 전달 |
| 사용자 피드백 수집 | 앱 내 피드백 API 호출 시 | Notion DB에 자동 저장 |

## 산출물 5: 배포 체크리스트

```markdown
## 배포 전 체크리스트

### 코드
- [ ] 모든 테스트 통과
- [ ] main 브랜치에 머지 완료
- [ ] Docker 이미지 빌드 성공

### 인프라
- [ ] AWS 리소스 프로비저닝 완료
- [ ] Security Group 설정 확인
- [ ] 환경변수 설정 완료 (Secrets Manager)
- [ ] SSL 인증서 적용

### 배포
- [ ] Docker 이미지 ECR 푸시 완료
- [ ] 서비스 배포 실행
- [ ] 헬스체크 통과 확인

### 배포 후
- [ ] 메인 페이지 접근 확인
- [ ] 크롤링 정상 동작 확인
- [ ] API 엔드포인트 응답 확인
- [ ] 푸시 알림 테스트
- [ ] 모니터링 대시보드 확인
- [ ] 롤백 절차 확인
```

## 결과물 저장 위치
- 코드: Git 레포지토리 (docker-compose.yml, .github/workflows/, Dockerfile 등)
- 문서: Notion `05_인프라/`

## 품질 기준
- `docker-compose up` 한 번으로 전체 로컬 환경이 구동되는가
- CI 파이프라인이 PR 생성 시 자동 실행되는가
- AWS 배포 후 헬스체크가 통과하는가
- 모니터링 알림이 정상 발송되는가
- .env.example에 모든 필수 환경변수가 포함되어 있는가