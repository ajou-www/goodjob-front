import application from '../types/application';
import { create } from 'zustand';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';

interface applyStore {
    applications: application[] | null;
    setApplications: (jobId: number) => Promise<number>;
    getApplications: () => Promise<void>;
    editApplications: (
        jobId: number,
        status: string,
        note: string | null,
        endDate: string | null
    ) => Promise<number>;
    deleteApplications: (jobId: number) => Promise<number>;
}

const useApplyStore = create<applyStore>((set) => ({
    applications: null,
    setApplications: async (jobId) => {
        const accessToken = useAuthStore.getState().accessToken;
        const res = await axiosInstance.post(`/applications/apply?jobId=${jobId}`, null, {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        });
        return res.status;
    },
    getApplications: async () => {
        const accessToken = useAuthStore.getState().accessToken;
        const res = await axiosInstance.get('/applications', {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        });
        set({ applications: res.data });
    },
    editApplications: async (jobId, status, note, endDate) => {
        const accessToken = useAuthStore.getState().accessToken;

        try {
            const res = await axiosInstance.put(
                `/applications?jobId=${jobId}`,
                {
                    applyStatus: status,
                    note: note,
                    applyDueDate: endDate,
                },
                { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
            );
            return res.status;
        } catch (error) {
            console.log('지원이력 수정 에러', error);
            throw error;
        }
    },
    deleteApplications: async (jobId) => {
        const accessToken = useAuthStore.getState().accessToken;
        const res = await axiosInstance.delete(`/applications?jobId=${jobId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        });
        return res.status;
    },
}));

export default useApplyStore;
