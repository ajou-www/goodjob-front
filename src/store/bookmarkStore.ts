import { create } from 'zustand';
import useAuthStore from './authStore';
import type Job from '../types/job';
import useJobStore from './jobStore';
import axiosInstance from '../api/axiosInstance';

interface bookmarkStore {
    bookmarkList: Job[] | null;
    setBookmarkList: (job: Job[]) => Promise<void>;
    addBookmark: (id: number) => Promise<number | undefined>;
    getBookmark: () => Promise<void>;
    removeBookmark: (id: number) => Promise<number | undefined>;
}

const useBookmarkStore = create<bookmarkStore>((set) => ({
    bookmarkList: null,
    setBookmarkList: async (bookmarkList: Job[] | null) => set({ bookmarkList }),
    addBookmark: async (id: number) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;

            // 낙관적 업데이트: API 호출 전에 상태 업데이트
            const currentBookmarks = useBookmarkStore.getState().bookmarkList || [];
            const jobToAdd = useJobStore.getState().jobList?.find((job) => job.id === id);

            if (jobToAdd && !currentBookmarks.some((bookmark) => bookmark.id === id)) {
                // 북마크 목록에 추가 (임시)
                set({
                    bookmarkList: [...currentBookmarks, { ...jobToAdd, isBookmarked: true }],
                });
            }

            const res = await axiosInstance.post(`/bookmark/add?JobId=${id}`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });

            return res.status;
        } catch (error) {
            // 오류 발생 시 이전 상태로 복원
            console.log(`북마크 추가 에러: ${error}`);
            await useBookmarkStore.getState().getBookmark();
        }
    },
    getBookmark: async () => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get('/bookmark/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
            set({ bookmarkList: res.data });
            return res.data;
        } catch (error) {
            console.log(`북마크 가져오기 에러: ${error}`);
            throw error;
            return [];
        }
    },
    removeBookmark: async (id: number) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;

            // 낙관적 업데이트: API 호출 전에 상태 업데이트
            const currentBookmarks = useBookmarkStore.getState().bookmarkList || [];

            // 북마크 목록에서 제거 (임시)
            set({
                bookmarkList: currentBookmarks.filter((bookmark) => bookmark.id !== id),
            });

            const res = await axiosInstance.delete(`/bookmark/remove?JobId=${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });

            console.log(`Remove bookmark: ${res.status}`);

            return res.status;
        } catch (error) {
            // 오류 발생 시 이전 상태로 복원
            console.log(`북마크 삭제 에러: ${error}`);
            await useBookmarkStore.getState().getBookmark();
        }
    },
}));

export default useBookmarkStore;
