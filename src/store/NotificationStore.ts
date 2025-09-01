import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from './authStore';
import Job from '../types/job';
import { notification, NotificationJobItem } from '../types/notification';

interface NotificationStore {
    notiList_match: notification[];
    notiList_due: notification[];
    notiJobList: Job[];
    jobIdList: Set<number>[];
    fetchRead: (notiId: number) => Promise<number>;
    getnotiJobList: (unreadOnly: boolean, type: string) => void;
    fetchNotiList: (unreadOnly: boolean, type: string) => void;
    fetchNotiJobList: (notis: NotificationJobItem[] | null) => void;
    deleteNoti: (id: number) => Promise<number>;
}

const useNotificationStore = create<NotificationStore>()((set) => ({
    notiList_match: [],
    notiList_due: [],
    notiJobList: [],
    jobIdList: [],
    fetchRead: async (id) => {
        const accessToken = useAuthStore.getState().accessToken;
        const res = await axiosInstance.patch(`/alarms/${id}/read`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });
        return res.status;
    },
    getnotiJobList: async (unreadOnly, type) => {
        const accessToken = useAuthStore.getState().accessToken;
        await axiosInstance.get(`/alarms?unreadOnly=${unreadOnly}&type=${type}&page=1&size=100`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });
    },

    fetchNotiList: async (unreadOnly, type) => {
        const accessToken = useAuthStore.getState().accessToken;

        const res = await axiosInstance.get(
            `/alarms?unreadOnly=${unreadOnly}&type=${type}&page=0&size=100`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );
        if (type === 'CV_MATCH') set({ notiList_match: res.data.content });
        if (type === 'APPLY_DUE') set({ notiList_due: res.data.content });

        // if (res.status === 200 && Array.isArray(res.data.content) && res.data.content.length > 0) {
        //     const jobIdTotalSet: Set<number>[] = [];

        //     res.data.content.forEach((item: notification) => {
        //         const jobIdSet = new Set<number>();
        //         item.jobs.forEach((job: { jobId: number }) => {
        //             if (typeof job.jobId === 'number') jobIdSet.add(job.jobId);
        //         });
        //         jobIdTotalSet.push(jobIdSet);
        //         set({ jobIdList: Array.from(jobIdTotalSet) });
        //         console.log(get().jobIdList);
        //     });
        // }
    },
    fetchNotiJobList: async (notis) => {
        const accessToken = useAuthStore.getState().accessToken;
        const jobIds: number[] = [];

        if (notis) {
            notis.forEach((item: { jobId: number }) => {
                if (typeof item.jobId === 'number') jobIds.push(item.jobId);
            });
        }

        if (jobIds.length > 0) {
            const res = await axiosInstance.get(`/jobs/_batch?ids=${jobIds.join(',')}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });

            if (res.status === 200) {
                set({ notiJobList: res.data });
            } else {
                set({ notiJobList: [] });
                console.log(res.statusText);
            }
        }
    },
    deleteNoti: async (id) => {
        const accessToken = useAuthStore.getState().accessToken;
        const res = await axiosInstance.delete(`/alarms/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });

        return res.status;
    },
}));

export default useNotificationStore;
