import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';

interface s3Store {
    url: string;
    getUploadPresignedURL: (fileName: string) => Promise<void>;
    getDownloadPresignedURL: (fileName: string) => Promise<string>;
    reNameCv: (oldFileName: string, newFileName: string) => Promise<string>;
}

const useS3Store = create<s3Store>((set) => ({
    url: '',
    getUploadPresignedURL: async (fileName) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get(`/s3/presigned-url/upload?fileName=${fileName}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
            set({ url: res.data });
            return res.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    throw new Error('이미 존재하는 별명입니다.');
                }
                throw new Error(`error: ${error.message}`);
            } else {
                throw error;
            }
        }
    },
    getDownloadPresignedURL: async (fileName) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.get(`/s3/presigned-url/download?fileName=${fileName}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
            const url = res.data;
            set({ url });
            return url;
        } catch (error) {
            console.log(`Presigned URL 에러: ${error}`);
            throw error;
        }
    },
    reNameCv: async (oldFileName, newFileName) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.post(
                `/s3/rename-cv?oldFileName=${oldFileName}&newFileName=${newFileName}`,
                null,
                { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
            );
            return res.data;
        } catch (error) {
            console.error('CV 수정 PresignedUrl 가져오기 오류: ', error);
            throw error;
        }
    },
}));

export default useS3Store;
