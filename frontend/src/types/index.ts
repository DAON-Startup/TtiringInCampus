export type NoticeCategory = 'ACADEMIC' | 'SCHOLARSHIP' | 'DEPARTMENT' | 'CAREER' | 'GENERAL' | 'DORMITORY' | 'EXTRACURRICULAR';

export interface University {
  universityId: number;
  name: string;
  domain: string;
}

export interface User {
  userId: number;
  email: string;
  nickname: string;
  departmentName?: string;
  notificationEnabled: boolean;
}

export interface Notice {
  noticeId: number;
  title: string;
  url: string;
  category: NoticeCategory;
  postedDate: string;
  sourceName: string;
}

export interface UserKeyword {
  keywordId: number;
  keyword: string;
  alertEnabled: boolean;
}

export interface Bookmark {
  bookmarkId: number;
  notice: Notice;
}

export interface AiReport {
  reportId: number;
  reportDate: string;
  summaryContent: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface NoticeListResponse {
  notices: Notice[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
