# 마스터 AI 에이전트 시스템 — README

## 이 시스템이 하는 일
프로젝트의 **기획→설계→개발→운영** 전 과정을 1개 마스터 에이전트 + 7개 서브 에이전트가 자동으로 수행한다. 사람은 각 단계의 체크포인트에서 결과를 검토하고 승인/피드백만 하면 된다.

## 파일 구조

```
agent-system/
│
├── README.md                      ← 지금 이 파일 (전체 개요)
├── PROJECT_CONTEXT.md             ← 프로젝트 도메인 지식 (프로젝트마다 교체)
│
├── agents/                        ← 에이전트별 지침서
│   ├── MASTER_AGENT.md            ← 마스터 오케스트레이터
│   ├── RESEARCH_AGENT.md          ← 리서치 (시장조사/경쟁사/레퍼런스)
│   ├── PLANNING_AGENT.md          ← 기획 (요구사항/MVP/사용자 스토리)
│   ├── ARCHITECTURE_AGENT.md      ← 설계 (ERD/API 명세/아키텍처)
│   ├── UI_DESIGN_AGENT.md         ← 디자인 (디자인 시스템/Figma 프로토타입)
│   ├── DEV_AGENT.md               ← 개발 (백엔드/프론트엔드/크롤러)
│   ├── INFRA_AGENT.md             ← 인프라 (Docker/CI·CD/AWS/모니터링)
│   └── OPS_AGENT.md               ← 운영 (모니터링/장애복구/피드백/리포트)
│
├── skills/                        ← 공유 스킬 (모든 에이전트가 참조)
│   ├── HUMAN_CHECKPOINT_SKILL.md  ← 사람 승인 요청 프로토콜
│   ├── NOTION_WRITE_SKILL.md      ← Notion 문서 저장 표준
│   └── CRAWLING_RESILIENCE_SKILL.md ← 크롤링 안정성/복구 절차
│
└── workflows/
    └── WORKFLOW.md                ← 전체 자동화 워크플로우 (Phase 1~4 상세)
```

## 시작 방법

### Step 1: PROJECT_CONTEXT.md 확인
- 프로젝트 도메인, 핵심 기능, 기술 스택이 정확한지 확인한다
- 새 프로젝트라면 이 파일을 전면 교체한다

### Step 2: 마스터 에이전트 실행
- Claude Code에서 MASTER_AGENT.md를 로드한다
- 마스터가 Phase 1 → STEP 1.1부터 자동 시작한다

### Step 3: 체크포인트에서 승인
- 각 Phase 전환 시 사람이 결과물을 검토한다
- 승인/수정/반려를 통해 다음 단계로 진행한다

## Claude Code / OpenCode CLI 환경 설정

### .opencode/agents/ 매핑
```
.opencode/agents/
├── research.md    → agents/RESEARCH_AGENT.md
├── planning.md    → agents/PLANNING_AGENT.md
├── architecture.md → agents/ARCHITECTURE_AGENT.md
├── ui-design.md   → agents/UI_DESIGN_AGENT.md
├── dev.md         → agents/DEV_AGENT.md
├── infra.md       → agents/INFRA_AGENT.md
└── ops.md         → agents/OPS_AGENT.md
```

### 모델 배정
| 에이전트 | 권장 모델 | 이유 |
|----------|-----------|------|
| 마스터 | Opus 4.6 | 복잡한 오케스트레이션, 정합성 판단 |
| 리서치 | Sonnet 4.6 | 웹 검색/정보 수집은 Sonnet으로 충분 |
| 기획 | Sonnet 4.6 | 구조화된 문서 생성 |
| 설계 | Opus 4.6 | ERD/아키텍처는 정밀도 필요 |
| 디자인 | Sonnet 4.6 | Figma 연동 작업 |
| 개발 | Opus 4.6 | 코드 생성 품질이 핵심 |
| 인프라 | Sonnet 4.6 | 설정 파일 생성은 Sonnet으로 충분 |
| 운영 | Sonnet 4.6 | 반복적 모니터링 작업 |

## 다른 프로젝트에 재사용하기

1. `PROJECT_CONTEXT.md`를 새 프로젝트에 맞게 교체
2. 불필요한 에이전트/스킬 제거 (예: 크롤링 없으면 CRAWLING_RESILIENCE_SKILL 삭제)
3. 필요한 에이전트 추가 (예: 마케팅 에이전트)
4. `WORKFLOW.md`의 Phase별 상세 플로우 조정
5. 마스터 에이전트 실행