import { create } from 'zustand';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';

interface serverData {
    name: string;
    uptime: number;
    responseTime: number;
    up: true;
}
interface adminServerInfoStore {
    serverInfo: serverData[];
    getServerInfo: () => Promise<void>;
}

const useAdminServerInfoStore = create<adminServerInfoStore>((set) => ({
    serverInfo: [],
    getServerInfo: async () => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get('/admin/dashboard/server-status', {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
            set({ serverInfo: res.data });
        } catch (error) {
            console.error('서버 정보 가져오기 오류: ', error);
            throw error;
        }
    },
}));

export default useAdminServerInfoStore;
