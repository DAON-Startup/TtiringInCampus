import { Notice, UserKeyword, Bookmark, AiReport, ApiResponse, NoticeListResponse } from '../types';

export const MOCK_NOTICES: Notice[] = [
  {
    noticeId: 1,
    title: '2026년 1학기 수강신청 일정 및 유의사항 안내',
    url: 'https://www.inu.ac.kr/inu/1516/subview.do',
    category: 'ACADEMIC',
    postedDate: '2026-04-01',
    sourceName: '학사 공지',
  },
  {
    noticeId: 2,
    title: '2026년 1학기 국가장학금 2차 신청 안내 (4/20 마감)',
    url: 'https://www.inu.ac.kr/inu/1534/subview.do',
    category: 'SCHOLARSHIP',
    postedDate: '2026-03-28',
    sourceName: '전체 공지',
  },
  {
    noticeId: 3,
    title: '컴퓨터공학부 2026-1 졸업논문 심사 신청 안내',
    url: 'https://cse.inu.ac.kr/isis/3519/subview.do',
    category: 'DEPARTMENT',
    postedDate: '2026-03-25',
    sourceName: '컴퓨터공학부 공지',
  },
  {
    noticeId: 4,
    title: '2026 상반기 삼성전자 S직군 채용설명회 (4/25)',
    url: 'https://www.inu.ac.kr/inu/1534/subview.do',
    category: 'CAREER',
    postedDate: '2026-03-20',
    sourceName: '취업경력개발원',
  },
  {
    noticeId: 5,
    title: '제40회 인천대학교 대동제 안내 (5/20~5/22)',
    url: 'https://www.inu.ac.kr/inu/1534/subview.do',
    category: 'GENERAL',
    postedDate: '2026-03-18',
    sourceName: '전체 공지',
  },
  {
    noticeId: 6,
    title: '2026년 1학기 생활관 입사 신청 안내 (4/5~4/12)',
    url: 'https://www.inu.ac.kr/inu/1534/subview.do',
    category: 'DORMITORY',
    postedDate: '2026-03-15',
    sourceName: '생활관 공지',
  },
  {
    noticeId: 7,
    title: '교내 SW 경진대회 참가자 모집 (5/10 마감)',
    url: 'https://www.inu.ac.kr/inu/1534/subview.do',
    category: 'ACADEMIC',
    postedDate: '2026-03-10',
    sourceName: '학사 공지',
  },
  {
    noticeId: 8,
    title: '2026년 1학기 성적우수 장학금 신청 안내',
    url: 'https://www.inu.ac.kr/inu/1534/subview.do',
    category: 'SCHOLARSHIP',
    postedDate: '2026-03-08',
    sourceName: '전체 공지',
  },
  {
    noticeId: 9,
    title: '컴퓨터공학부 2026-1 전공 설명회 (3/25)',
    url: 'https://cse.inu.ac.kr/isis/3519/subview.do',
    category: 'DEPARTMENT',
    postedDate: '2026-03-05',
    sourceName: '컴퓨터공학부 공지',
  },
  {
    noticeId: 10,
    title: '학생상담센터 상반기 심리검사 프로그램 신청',
    url: 'https://www.inu.ac.kr/inu/1534/subview.do',
    category: 'GENERAL',
    postedDate: '2026-03-01',
    sourceName: '전체 공지',
  },
];

export const MOCK_KEYWORDS: UserKeyword[] = [
  { keywordId: 1, keyword: '장학금', alertEnabled: true },
  { keywordId: 2, keyword: '수강신청', alertEnabled: true },
];

export const MOCK_BOOKMARKS: Bookmark[] = [
  { bookmarkId: 1, notice: MOCK_NOTICES[0] },
  { bookmarkId: 2, notice: MOCK_NOTICES[2] },
];

export const MOCK_REPORTS: AiReport[] = [
  {
    reportId: 1,
    reportDate: '2026-04-06',
    summaryContent:
      '오늘의 주요 공지 요약\n\n• 1학기 수강신청 일정이 4/15~4/17로 확정되었습니다.\n• 국가장학금 2차 신청이 4/20까지 진행됩니다. 한국장학재단 사이트에서 신청하세요.\n• 컴퓨터공학부 졸업논문 심사 신청은 4/10까지입니다.',
  },
  {
    reportId: 2,
    reportDate: '2026-04-05',
    summaryContent:
      '어제의 주요 공지 요약\n\n• 삼성전자 S직군 채용설명회가 4/25에 예정되어 있습니다.\n• 봄 캠퍼스 축제(대동제)가 5/20~5/22로 확정되었습니다.\n• 생활관 입사 신청이 4/5~4/12에 진행됩니다.',
  },
];

function mockResponse<T>(data: T): { data: ApiResponse<T> } {
  return { data: { success: true, data } };
}

export const mockNoticeApi = {
  getNotices: async (category?: string, page: number = 0) => {
    const filtered = category
      ? MOCK_NOTICES.filter((n) => n.category === category)
      : MOCK_NOTICES;
    return mockResponse<NoticeListResponse>({
      notices: filtered,
      totalCount: filtered.length,
      totalPages: 1,
      currentPage: page,
    });
  },
  getNotice: async (id: number) =>
    mockResponse(MOCK_NOTICES.find((n) => n.noticeId === id) ?? MOCK_NOTICES[0]),
  searchNotices: async (keyword: string, page: number = 0) => {
    const results = MOCK_NOTICES.filter((n) => n.title.includes(keyword));
    return mockResponse<NoticeListResponse>({
      notices: results,
      totalCount: results.length,
      totalPages: 1,
      currentPage: page,
    });
  },
};

export const mockKeywordApi = {
  getKeywords: async () => mockResponse(MOCK_KEYWORDS),
  addKeyword: async (keyword: string) =>
    mockResponse<UserKeyword>({ keywordId: Date.now(), keyword, alertEnabled: true }),
  deleteKeyword: async (_id: number) => mockResponse<void>(undefined as void),
};

export const mockBookmarkApi = {
  getBookmarks: async () => mockResponse(MOCK_BOOKMARKS),
  addBookmark: async (noticeId: number) =>
    mockResponse<Bookmark>({
      bookmarkId: Date.now(),
      notice: MOCK_NOTICES.find((n) => n.noticeId === noticeId) ?? MOCK_NOTICES[0],
    }),
  deleteBookmark: async (_id: number) => mockResponse<void>(undefined as void),
};

export const mockReportApi = {
  getReports: async () => mockResponse(MOCK_REPORTS),
  getReport: async (id: number) =>
    mockResponse(MOCK_REPORTS.find((r) => r.reportId === id) ?? MOCK_REPORTS[0]),
};
