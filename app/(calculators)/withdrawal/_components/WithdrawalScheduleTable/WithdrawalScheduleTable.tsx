import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import useStore from "@/utils/WithdrawalStore/withdrawal-store";
import { Card } from "primereact/card";

const WithdrawalScheduleTable = () => {
  const payments = useStore((state) => state.payments);

  // Function to handle CSV export
  const exportCSV = () => {
    const csvHeader =
      "Month,Total Payment,Interest Payment,Principal Withdrawal,Remaining Wealth\n";
    const csvRows = payments
      .map(
        (payment) =>
          `${payment.month},${payment.totalPayment.toFixed(
            2
          )},${payment.interestPayment.toFixed(
            2
          )},${payment.principalWithdrawal.toFixed(
            2
          )},${payment.remainingWealth.toFixed(2)}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "withdrawal-schedule.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number): string => {
    return `€${value.toFixed(2)}`;
  };

  const currencyBodyTemplate = (rowData: any, field: string): JSX.Element => {
    return <>{formatCurrency(rowData[field])}</>;
  };

  return (
    <Card>
      <div>
        <DataTable
          value={payments}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="month" header="Monat" />
          <Column
            field="totalPayment"
            header="Entnahmerate"
            body={(rowData) => currencyBodyTemplate(rowData, "totalPayment")}
          />
          <Column
            field="interestPayment"
            header="Zinseinkommen"
            body={(rowData) => currencyBodyTemplate(rowData, "interestPayment")}
          />
          <Column
            field="principalWithdrawal"
            header="Abschmelzung"
            body={(rowData) =>
              currencyBodyTemplate(rowData, "principalWithdrawal")
            }
          />
          <Column
            field="remainingWealth"
            header="Restkapital"
            body={(rowData) => currencyBodyTemplate(rowData, "remainingWealth")}
          />
        </DataTable>
      </div>
      <div>
        <Button
          label="Exportieren"
          icon="pi pi-file-excel"
          onClick={exportCSV}
        />
      </div>
    </Card>
  );
};

export default WithdrawalScheduleTable;
