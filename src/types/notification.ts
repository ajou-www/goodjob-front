export interface NotificationJobItem {
    jobId: number;
    rank: number;
    clicked: boolean | null;
}

export type NotificationType = 'CV_MATCH' | 'APPLY_DUE' | 'JOB_POPULAR';

export interface notification {
    id: number;
    createdAt: string;
    alarmText: string;
    userId: number;
    read: boolean;
    readAt: string | null;
    type: NotificationType;
    dedupeKey: string;
    status: string;
    sentAt: string;
    jobs: NotificationJobItem[];
    titleCode: string;
    params: { threshold: number; topN: number };
}
