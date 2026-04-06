import apiClient from './client';
import { ApiResponse, NoticeCategory, NoticeListResponse, Notice, UserKeyword, Bookmark, AiReport } from '../types';
import { mockNoticeApi, mockKeywordApi, mockBookmarkApi, mockReportApi } from './mockData';

// 백엔드 연결 불가 시 mock으로 fallback
function isNetworkError(error: any): boolean {
  return !error.response;
}

export const authApi = {
  login: (data: any) => apiClient.post('/api/v1/auth/login', data),
  logout: () => apiClient.post('/api/v1/auth/logout'),
};

export const noticeApi = {
  getNotices: async (category?: NoticeCategory, page: number = 0) => {
    try {
      return await apiClient.get<ApiResponse<NoticeListResponse>>('/api/v1/notices', {
        params: { category, page, size: 20 },
      });
    } catch (error) {
      if (isNetworkError(error)) return mockNoticeApi.getNotices(category, page) as any;
      throw error;
    }
  },
  getNotice: async (id: number) => {
    try {
      return await apiClient.get<ApiResponse<Notice>>(`/api/v1/notices/${id}`);
    } catch (error) {
      if (isNetworkError(error)) return mockNoticeApi.getNotice(id) as any;
      throw error;
    }
  },
  searchNotices: async (keyword: string, page: number = 0) => {
    try {
      return await apiClient.get<ApiResponse<NoticeListResponse>>('/api/v1/notices/search', {
        params: { keyword, page, size: 20 },
      });
    } catch (error) {
      if (isNetworkError(error)) return mockNoticeApi.searchNotices(keyword, page) as any;
      throw error;
    }
  },
};

export const keywordApi = {
  getKeywords: async () => {
    try {
      return await apiClient.get<ApiResponse<UserKeyword[]>>('/api/v1/keywords');
    } catch (error) {
      if (isNetworkError(error)) return mockKeywordApi.getKeywords() as any;
      throw error;
    }
  },
  addKeyword: async (keyword: string) => {
    try {
      return await apiClient.post<ApiResponse<UserKeyword>>('/api/v1/keywords', { keyword });
    } catch (error) {
      if (isNetworkError(error)) return mockKeywordApi.addKeyword(keyword) as any;
      throw error;
    }
  },
  deleteKeyword: async (id: number) => {
    try {
      return await apiClient.delete<ApiResponse<void>>(`/api/v1/keywords/${id}`);
    } catch (error) {
      if (isNetworkError(error)) return mockKeywordApi.deleteKeyword(id) as any;
      throw error;
    }
  },
};

export const bookmarkApi = {
  getBookmarks: async () => {
    try {
      return await apiClient.get<ApiResponse<Bookmark[]>>('/api/v1/bookmarks');
    } catch (error) {
      if (isNetworkError(error)) return mockBookmarkApi.getBookmarks() as any;
      throw error;
    }
  },
  addBookmark: async (noticeId: number) => {
    try {
      return await apiClient.post<ApiResponse<Bookmark>>(`/api/v1/bookmarks/${noticeId}`);
    } catch (error) {
      if (isNetworkError(error)) return mockBookmarkApi.addBookmark(noticeId) as any;
      throw error;
    }
  },
  deleteBookmark: async (id: number) => {
    try {
      return await apiClient.delete<ApiResponse<void>>(`/api/v1/bookmarks/${id}`);
    } catch (error) {
      if (isNetworkError(error)) return mockBookmarkApi.deleteBookmark(id) as any;
      throw error;
    }
  },
};

export const reportApi = {
  getReports: async () => {
    try {
      return await apiClient.get<ApiResponse<AiReport[]>>('/api/v1/reports');
    } catch (error) {
      if (isNetworkError(error)) return mockReportApi.getReports() as any;
      throw error;
    }
  },
  getReport: async (id: number) => {
    try {
      return await apiClient.get<ApiResponse<AiReport>>(`/api/v1/reports/${id}`);
    } catch (error) {
      if (isNetworkError(error)) return mockReportApi.getReport(id) as any;
      throw error;
    }
  },
};
