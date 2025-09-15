import { create } from 'zustand';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';

export interface CvMe {
    id: number;
    userId: number;
    fileName: string;
    uploadedAt: Date;
}

interface cvStore {
    userCvList: CvMe[];
    userCvError: string | null;
    getUserCvList: () => Promise<void>;
}

const useCvStore = create<cvStore>((set) => ({
    userCvList: [],
    userCvError: null,
    getUserCvList: async () => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get('/cv/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
            set({
                userCvList: res.data,
                userCvError: null,
            });
        } catch (error) {
            set({ userCvError: '유저 CV 정보 가져오기 오류' });
            throw error;
        }
    },
}));

export default useCvStore;
