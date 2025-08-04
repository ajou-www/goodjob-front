import { create } from 'zustand';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';

interface logStore {
    sendClickEvent: (jobId: number) => void;
}

const useLogStore = create<logStore>(() => ({
    sendClickEvent: (jobId) => {
        axiosInstance
            .post(`/log/event?jobId=${jobId}&event=click`, null, {
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            .catch((err) => {
                console.error('click 전송 실패:', err);
            });
    },
}));

export default useLogStore;
