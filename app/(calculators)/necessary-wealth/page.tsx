"use client";

import { Card } from "primereact/card";
import NecessaryWealthForm from "./_components/NecessaryWealthForm/NecessaryWealthForm";

const WealthWithdrawalCalculator = () => {
  return (
    <Card>
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto flex flex-col md:flex-row">
          <div className="md:flex-1">
            <NecessaryWealthForm />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WealthWithdrawalCalculator;
