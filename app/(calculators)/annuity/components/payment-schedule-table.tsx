import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import useStore from "@/utils/store";
import { Card } from "primereact/card";

const PaymentScheduleTable = () => {
  const payments = useStore((state) => state.payments);

  // Function to handle CSV export
  const exportCSV = () => {
    const csvHeader =
      "Month,Total Payment,Interest Payment,Principal Payment,Remaining Loan\n";
    const csvRows = payments
      .map(
        (payment) =>
          `${payment.month},${payment.totalPayment.toFixed(
            2
          )},${payment.interestPayment.toFixed(
            2
          )},${payment.principalPayment.toFixed(
            2
          )},${payment.remainingLoan.toFixed(2)}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "payment-schedule.csv");
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
            header="Kreditrate"
            body={(rowData) => currencyBodyTemplate(rowData, "totalPayment")}
          />
          <Column
            field="interestPayment"
            header="Zinszahlung"
            body={(rowData) => currencyBodyTemplate(rowData, "interestPayment")}
          />
          <Column
            field="principalPayment"
            header="Tilgung"
            body={(rowData) =>
              currencyBodyTemplate(rowData, "principalPayment")
            }
          />
          <Column
            field="remainingLoan"
            header="Restschuld"
            body={(rowData) => currencyBodyTemplate(rowData, "remainingLoan")}
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

export default PaymentScheduleTable;
