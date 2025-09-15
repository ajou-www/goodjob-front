import { create } from 'zustand';
import {
    amountType,
    cancelPaymentsType,
    confirmPaymentsType,
    billingType,
    verifyResponse,
} from '../types/billing';
import useAuthStore from './authStore';
import axiosInstance from '../api/axiosInstance';

interface billingStore {
    amount: billingType;
    planName: string;
    setPlanName: (planName: string) => void;
    setAmount: (amount: billingType) => void;
    saveAmountInfo: (amount: amountType) => Promise<number>;
    verifyAmountInfo: (amount: amountType) => Promise<verifyResponse>;
    confirmPayments: (amount: confirmPaymentsType) => Promise<verifyResponse>;
    cancelPayments: (cancel: cancelPaymentsType) => Promise<number>;
}

const useBillingStore = create<billingStore>((set) => ({
    amount: { currency: 'KRW', value: 0 },
    planName: '',
    setPlanName: (planName) => set({ planName: planName }),
    setAmount: (amount) => set({ amount: amount }),
    saveAmountInfo: async (json) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.post('/payments/saveAmount', json, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
            return res.status;
        } catch (error) {
            console.error('결제 정보 임시 저장 오류: ', error);
            alert('결제가 완료되지 않았습니다, 관리자에게 문의하세요.');
            throw error;
        }
    },
    verifyAmountInfo: async (json) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.post('/payments/verifyAmount', json, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error('결제 정보 검증 오류: ', error);
            alert('결제가 완료되지 않았습니다, 관리자에게 문의하세요.');
            throw error;
        }
    },
    confirmPayments: async (json) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.post('/payments/confirm', json, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error('토스 결제 확정 오류: ', error);
            alert('결제가 완료되지 않았습니다, 관리자에게 문의하세요.');
            throw error;
        }
    },
    cancelPayments: async (json) => {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            const res = await axiosInstance.post('/payments/cancel', json, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
            return res.status;
        } catch (error) {
            console.error('결제 취소 오류: ', error);
            alert('결제 취소 오류: 관리자에게 문의하세요.');
            throw error;
        }
    },
}));

export default useBillingStore;
