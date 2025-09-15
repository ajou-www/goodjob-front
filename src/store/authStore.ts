import axiosInstance from '../api/axiosInstance';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
    accessToken: string | null;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setLogout: (accessToken: string | null) => Promise<void>;
    setForceLogout: () => void;
    setTokens: (accessToken: string | null) => void;
    clearTokens: () => void;
    fetchAuthData: () => Promise<void>;
    withdraw: (accessToken: string | null) => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: null,
            isLoggedIn: false,
            setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
            setTokens: (accessToken) => set({ accessToken, isLoggedIn: !!accessToken }),
            clearTokens: () => set({ accessToken: null, isLoggedIn: false }),
            fetchAuthData: async () => {},
            setLogout: async (accessToken) => {
                const res = await axiosInstance.post('/auth/logout', null, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                });
                try {
                    if (res.status === 200) {
                        set({ accessToken: null, isLoggedIn: false });
                        localStorage.removeItem('admin-job-storage');
                        localStorage.removeItem('admin-storage');
                        localStorage.removeItem('page-storage');
                        localStorage.removeItem('user-token');
                    }
                } catch (error) {
                    alert('로그아웃 실패: 문제가 지속될 시 관리자에게 문의하세요.');
                    throw error;
                }
            },
            setForceLogout: () => {
                // 리프레시 토큰 에러 상황: 로컬 스토리지 지우기
                set({ accessToken: null, isLoggedIn: false });
                localStorage.removeItem('admin-job-storage');
                localStorage.removeItem('admin-storage');
                localStorage.removeItem('page-storage');
                localStorage.removeItem('user-token');
            },
            withdraw: async (accessToken) => {
                try {
                    const res = await axiosInstance.delete('/auth/withdraw', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        withCredentials: true,
                    });
                    if (res.status === 200) {
                        localStorage.clear();
                    }
                } catch (error) {
                    alert('탈퇴 중 에러 발생: 문제가 지속될 시 관리자에게 문의하세요.');
                    throw error;
                }
            },
        }),
        {
            name: 'user-token',
            partialize: (state) => ({
                accessToken: state.accessToken,
            }),
            onRehydrateStorage: () => {
                return (state) => {
                    if (state && state.accessToken) {
                        state.isLoggedIn = true;
                    }
                };
            },
        }
    )
);

export default useAuthStore;
