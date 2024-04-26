"use client"

import { Card } from "primereact/card";
import AnnuityChart from "./components/annuity-chart";
import AnnuityCalculatorForm from "./components/annuity-form";
import RemainingLoanChart from "./components/remaining-loan-chart";
import PaymentScheduleTable from "./components/payment-schedule-table";

const AnnuityCalculator = () => {
    return (
        <Card>
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto flex flex-col md:flex-row">
                <div className="md:flex-1">
                    <AnnuityCalculatorForm/>
                    <PaymentScheduleTable />
                </div>
                <div className="md:flex-1">
                    <AnnuityChart />
                    <RemainingLoanChart />
                </div>
            </div>
        </div>
        </Card>
    );
};

export default AnnuityCalculator;
