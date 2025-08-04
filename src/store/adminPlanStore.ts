import { create } from 'zustand';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';

interface PlanData {
    starter: number;
    basic: number;
    enterprise: number;
}

interface AdminPlanStore {
    plan: PlanData;
    getPlan: () => Promise<void>;
}

const useAdminPlanStore = create<AdminPlanStore>((set) => ({
    plan: {
        starter: 0.0,
        basic: 0.0,
        enterprise: 0.0,
    },
    getPlan: async () => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get('/admin/dashboard/plan', {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
            set({ plan: res.data });
        } catch (error) {
            console.error('플랜 데이터 가져오기 오류: ', error);
            throw error;
        }
    },
}));

export default useAdminPlanStore;
