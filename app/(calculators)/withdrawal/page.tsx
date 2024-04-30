"use client"

import { Card } from "primereact/card";
import WithdrawalChart from "./_components/WithdrawalChart/WithdrawalChart";
import WithdrawalCalculatorForm from "./_components/WithdrawalForm/WithdrawalForm";
import RemainingWealthChart from "./_components/RemainingWealthChart/RemainingWealthChart";
import WithdrawalScheduleTable from "./_components/WithdrawalScheduleTable/WithdrawalScheduleTable";

const WithdrawalCalculator = () => {
    return (
        <Card>
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto flex flex-col md:flex-row">
                <div className="md:flex-1">
                    <WithdrawalCalculatorForm />
                    {/* Adding space between calculator form and payment table */}
                    <div style={{ marginTop: '2rem' }}> 
                        <WithdrawalScheduleTable />
                    </div>
                </div>
                <div className="md:flex-1">
                    <WithdrawalChart />
                    <RemainingWealthChart />
                </div>
            </div>
        </div>
        </Card>
    );
};

export default WithdrawalCalculator;
