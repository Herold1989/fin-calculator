import {create} from 'zustand';

interface Payment {
    month: string;
    totalPayment: number;
    interestPayment: number;
    principalWithdrawal: number;
    remainingWealth: number;
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
