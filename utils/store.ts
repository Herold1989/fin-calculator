import {create} from 'zustand';

interface Payment {
    month: string;
    totalPayment: number;
    interestPayment: number;
    principalPayment: number;
    remainingLoan: number;
}

interface StoreState {
    payments: Payment[];
    setPayments: (payments: Payment[]) => void;
}

const useStore = create<StoreState>(set => ({
  payments: [],
  setPayments: (payments) => set({ payments })
}));

export default useStore;
