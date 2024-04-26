import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import useStore from '@/utils/store';

const PaymentScheduleTable = () => {
    const payments = useStore(state => state.payments);

    // Function to handle CSV export
    const exportCSV = () => {
        const csvHeader = "Month,Total Payment,Interest Payment,Principal Payment,Remaining Loan\n";
        const csvRows = payments.map(payment => 
            `${payment.month},${payment.totalPayment.toFixed(2)},${payment.interestPayment.toFixed(2)},${payment.principalPayment.toFixed(2)},${payment.remainingLoan.toFixed(2)}`
        ).join("\n");
        
        const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "payment-schedule.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <Button label="Export to CSV" icon="pi pi-download" className="p-button-help" onClick={exportCSV} />
            <DataTable value={payments} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column field="month" header="Month" />
                <Column field="totalPayment" header="Total Payment" />
                <Column field="interestPayment" header="Interest Payment" />
                <Column field="principalPayment" header="Principal Payment" />
                <Column field="remainingLoan" header="Remaining Loan" />
            </DataTable>
        </div>
    );
};

export default PaymentScheduleTable;
