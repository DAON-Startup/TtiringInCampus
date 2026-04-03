# 프로젝트 컨텍스트

## 서비스 개요
띠링인캠퍼스는 대학 공지사항을 자동으로 수집하고 학생들에게 푸시 알림으로 전달하는 서비스입니다.

## 기술 스택
- **백엔드**: Spring Boot (Java)
- **프론트엔드**: React Native (TypeScript)
- **자동화**: n8n
- **인프라**: Docker, Nginx

## 주요 기능
- 대학별 공지사항 크롤링
- 카테고리별 알림 필터링
- 모바일 푸시 알림

## 아키텍처 결정 사항
- n8n으로 공지사항 수집 자동화
- Spring Boot REST API로 데이터 제공
- React Native로 iOS/Android 통합 앱
