# 띠링인캠퍼스 (TtingInCampus)

> 대학 공지사항 자동 수집 및 알림 서비스

## 프로젝트 구조

```
TtitingInCampus/
├── .ai/                  # 에이전트 시스템 (Claude Code 참조용)
├── backend/              # Spring Boot 백엔드
├── frontend/             # React Native 앱
├── n8n-workflows/        # n8n 자동화 워크플로우
├── scripts/              # 서버 셋업 및 Nginx 설정
└── .github/workflows/    # CI/CD 파이프라인
```

## 시작하기

```bash
cp .env.example .env
docker-compose up -d
```
