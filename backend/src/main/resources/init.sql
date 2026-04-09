-- ═══════════════════════════════════════════════════════
-- 대학교 통합 공지사항 서비스 - DB 초기화 스크립트
-- ERD v1.2 기반
-- ═══════════════════════════════════════════════════════

-- ─── universities ───
CREATE TABLE universities (
    university_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── departments ───
CREATE TABLE departments (
    department_id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL REFERENCES universities(university_id),
    name VARCHAR(100) NOT NULL,
    college VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_departments_university ON departments(university_id);

-- ─── users ───
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    department_id BIGINT REFERENCES departments(department_id),
    fcm_token VARCHAR(500),
    refresh_token VARCHAR(500),
    notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

-- ─── notice_sources ───
CREATE TABLE notice_sources (
    source_id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL REFERENCES universities(university_id),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    base_url VARCHAR(500) NOT NULL,
    list_url_template VARCHAR(500),
    llm_parse_prompt TEXT,
    schedule VARCHAR(50) DEFAULT '0 */1 * * *',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notice_sources_university ON notice_sources(university_id);

-- ─── notices ───
CREATE TABLE notices (
    notice_id BIGSERIAL PRIMARY KEY,
    source_id BIGINT NOT NULL REFERENCES notice_sources(source_id),
    external_id VARCHAR(100),
    title VARCHAR(500) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    category VARCHAR(50) NOT NULL,
    posted_date DATE,
    url_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notices_source_id ON notices(source_id);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_posted_date ON notices(posted_date DESC);
CREATE INDEX idx_notices_title_gin ON notices USING GIN (to_tsvector('simple', title));
CREATE UNIQUE INDEX uq_notices_url_hash ON notices(url_hash);

-- ─── user_keywords ───
CREATE TABLE user_keywords (
    keyword_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    alert_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_user_keywords_user ON user_keywords(user_id);

-- ─── keyword_alerts ───
CREATE TABLE keyword_alerts (
    alert_id BIGSERIAL PRIMARY KEY,
    keyword_id BIGINT NOT NULL REFERENCES user_keywords(keyword_id) ON DELETE CASCADE,
    notice_id BIGINT NOT NULL REFERENCES notices(notice_id) ON DELETE CASCADE,
    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_keyword_alerts_keyword ON keyword_alerts(keyword_id);
CREATE INDEX idx_keyword_alerts_unsent ON keyword_alerts(is_sent) WHERE is_sent = FALSE;

-- ─── bookmarks ───
CREATE TABLE bookmarks (
    bookmark_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    notice_id BIGINT NOT NULL REFERENCES notices(notice_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, notice_id)
);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

-- ─── user_subscriptions (2차) ───
CREATE TABLE user_subscriptions (
    subscription_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    source_id BIGINT NOT NULL REFERENCES notice_sources(source_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, source_id)
);

-- ─── ai_reports ───
CREATE TABLE ai_reports (
    report_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    summary_content TEXT NOT NULL,
    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, report_date)
);
CREATE INDEX idx_ai_reports_user_date ON ai_reports(user_id, report_date DESC);

-- ─── crawl_logs ───
CREATE TABLE crawl_logs (
    log_id BIGSERIAL PRIMARY KEY,
    source_id BIGINT NOT NULL REFERENCES notice_sources(source_id),
    status VARCHAR(50) NOT NULL,
    notices_found INTEGER DEFAULT 0,
    new_notices INTEGER DEFAULT 0,
    error_message TEXT,
    response_time_ms INTEGER,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_crawl_logs_source ON crawl_logs(source_id, executed_at DESC);

-- ═══════════════════════════════════════════════════════
-- 초기 데이터 (인천대학교)
-- ═══════════════════════════════════════════════════════

INSERT INTO universities (name, domain) VALUES ('인천대학교', 'inu.ac.kr');

-- 학과 (주요 학과만 - 추후 확장)
INSERT INTO departments (university_id, name, college) VALUES
(1, '컴퓨터공학부', '정보기술대학'),
(1, '정보통신공학과', '정보기술대학'),
(1, '임베디드시스템공학과', '정보기술대학'),
(1, '경영학부', '경영대학'),
(1, '경제학과', '사회과학대학'),
(1, '행정학과', '사회과학대학'),
(1, '영어영문학과', '인문대학'),
(1, '국어국문학과', '인문대학'),
(1, '기계공학과', '공과대학'),
(1, '전기공학과', '공과대학'),
(1, '토목환경공학과', '공과대학'),
(1, '도시건축학부', '도시과학대학'),
(1, '생명과학부', '자연과학대학'),
(1, '수학과', '자연과학대학'),
(1, '체육학부', '예술체육대학'),
(1, '디자인학부', '예술체육대학'),
(1, '동북아국제통상전공', '동북아국제통상학부');

-- 크롤링 소스
INSERT INTO notice_sources (university_id, name, category, base_url, list_url_template, llm_parse_prompt) VALUES
(1, '전체 공지', 'GENERAL', 'https://www.inu.ac.kr', 'https://www.inu.ac.kr/inu/1534/subview.do', '아래 HTML에서 공지사항 목록을 추출하여 {external_id, title, posted_date(YYYY-MM-DD), url} JSON 배열로 반환하라. 게시글 번호, 제목, 작성일, 상세페이지 링크를 추출한다.'),
(1, '학사 공지', 'ACADEMIC', 'https://www.inu.ac.kr', 'https://www.inu.ac.kr/inu/1516/subview.do', '아래 HTML에서 학사 공지사항 목록을 추출하여 {external_id, title, posted_date(YYYY-MM-DD), url} JSON 배열로 반환하라.'),
(1, '컴퓨터공학부 공지', 'DEPARTMENT', 'https://cse.inu.ac.kr', 'https://cse.inu.ac.kr/isis/3519/subview.do', '아래 HTML에서 컴퓨터공학부 공지사항 목록을 추출하여 {external_id, title, posted_date(YYYY-MM-DD), url} JSON 배열로 반환하라.');
