import { create } from 'zustand';
import Job from '../types/job';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';
import { CvMe } from './cvStore';

interface RecommendationState {
    selectedCVId: number | null;
    recommendationsCache: Record<number, Job[]>; // key: cvId, value: 추천 리스트
    setSelectedCVId: (cvId: number) => void;
    setRecommendations: (cvId: number, data: Job[]) => void;
    getSelectedCVId: () => Promise<number>;
}

const useRecommendationStore = create<RecommendationState>((set) => ({
    selectedCVId: null,
    recommendationsCache: {},
    setSelectedCVId: (cvId) => set({ selectedCVId: cvId }),
    setRecommendations: (cvId, data) =>
        set((state) => ({
            recommendationsCache: { ...state.recommendationsCache, [cvId]: data },
        })),

    getSelectedCVId: async () => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get('/cv/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
            // uploadedAt이 가장 최근인 CV 선택
            const latestCV = res.data.reduce((latest: CvMe, current: CvMe) => {
                return new Date(current.uploadedAt) > new Date(latest.uploadedAt)
                    ? current
                    : latest;
            }, res.data[0]);
            set({ selectedCVId: latestCV.id });
            return latestCV.id;
        } catch (error) {
            console.error('유저 CV 정보 가져오기 오류: ', error);
            throw error;
        }
    },
}));

export default useRecommendationStore;
