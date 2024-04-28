"use client"

import { Card } from "primereact/card";
import AnnuityChart from "./components/AnnuityChart/AnnuityChart";
import AnnuityCalculatorForm from "./components/AnnuityForm/AnnuityForm";
import RemainingLoanChart from "./components/RemainingLoanChart/RemainingLoanChart";
import PaymentScheduleTable from "./components/PaymentScheduleTable/PaymentScheduleTable";

const AnnuityCalculator = () => {
    return (
        <Card>
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto flex flex-col md:flex-row">
                <div className="md:flex-1">
                    <AnnuityCalculatorForm />
                    {/* Adding space between calculator form and payment table */}
                    <div style={{ marginTop: '2rem' }}> 
                        <PaymentScheduleTable />
                    </div>
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
