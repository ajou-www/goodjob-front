import { create } from 'zustand';
import useAuthStore from './authStore';
import useUserStore from './userStore';
import axiosInstance from '../api/axiosInstance';

interface fileStore {
    file: File | null;
    hasFile: boolean;
    summary: string | null;
    setFile: (file: File | null) => void;
    setHasFile: (exists: boolean) => void;
    removeFile: (cvId: number) => Promise<number>;
    removeAllFile: () => Promise<number>;
    getSummary: (selectedCVId: number) => Promise<void>;
    uploadFile: (file: File | null, url: string, fileName: string) => Promise<number | undefined>;
    reUploadFile: (file: File | null, url: string) => Promise<void>;
}

const useFileStore = create<fileStore>((set) => ({
    file: null,
    summary: null,
    hasFile: false,
    setFile: (file: File | null) => set({ file }),
    setHasFile: (exists) => set({ hasFile: exists }),
    removeFile: async (cvId) => {
        const accessToken = useAuthStore.getState().accessToken;
        const res = await axiosInstance.delete(`/cv/delete-cv?cvId=${cvId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });
        return res.status;
    },
    removeAllFile: async () => {
        const accessToken = useAuthStore.getState().accessToken;
        const res = await axiosInstance.delete(`/cv/delete-all-cvs`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });
        return res.status;
    },
    getSummary: async (selectedCVId) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.post(`/cv/summary-cv?cvId=${selectedCVId}`, null, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });

            set({ summary: res.data.summary });
        } catch (error) {
            console.error('CV 요약 가져오기 에러: ', error);
            throw error;
        }
    },
    uploadFile: async (file: File | null, url: string, fileName: string) => {
        if (!file) {
            console.log('파일이 비어있습니다');
            return;
        }
        try {
            const res = await axiosInstance.put(url, file, {
                // S3에 파일 업로드
                headers: { 'Content-Type': file.type },
            });

            if (res.status === 200) {
                const accessToken = useAuthStore.getState().accessToken;

                const confirm = await axiosInstance.post(
                    `/s3/confirm-upload?fileName=${fileName}`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        withCredentials: true,
                    }
                );

                console.log(confirm.status);
                return confirm.status;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    reUploadFile: async (file: File | null, url: string) => {
        if (!file) {
            console.log('파일이 비어있습니다');
            return;
        }
        try {
            const res = await axiosInstance.put(url, file, {
                headers: { 'Content-Type': file.type },
            });

            if (res.status === 200) {
                const accessToken = useAuthStore.getState().accessToken;
                const userEmail = useUserStore.getState().email;
                const userId = useUserStore.getState().id;
                const fileName = userEmail.split('@')[0];

                const confirm = await axiosInstance.post(
                    `/s3/confirm-re-upload?fileName=${fileName}_${userId}`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        withCredentials: true,
                    }
                );

                console.log(confirm);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
}));

export default useFileStore;
