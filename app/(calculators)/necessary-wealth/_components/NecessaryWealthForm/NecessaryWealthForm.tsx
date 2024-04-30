import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { currencyFormatter } from "@/utils/formatCurrency";

const NecessaryWealthForm = () => {
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [years, setYears] = useState(1);
  const [interestRate, setInterestRate] = useState(0);
  const [results, setResults] = useState("");

  const handleYearsChange = (e: InputNumberValueChangeEvent) => {
    setYears(e.value ?? 1);
  };

  const handleInterestRateChange = (e: InputNumberValueChangeEvent) => {
    setInterestRate(e.value ?? 0);
  };

  const calculateNecessaryWealth = (
    monthlyPayment: number,
    annualInterestRate: number,
    periodYears: number
  ) => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = periodYears * 12;
    const annuityFactor =
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    return monthlyPayment / annuityFactor;
  };

  const handleSubmit = () => {
    const necessaryWealth = calculateNecessaryWealth(
      monthlyRate,
      interestRate,
      years
    );
    const formattedWealth = currencyFormatter.format(necessaryWealth); // Format and set the results

    setResults(`Benötigtes Kapital: ${formattedWealth}`);
  };

  return (
    <Card
      title="Kapitalbedarfsrechner"
      subTitle="Wieviel Kapital brauchst Du um für einen bestimmten Zeitraum eine bestimmte, regelmäßige Summe entnehmen zu können?"
      footer={
        <Button
          className="mt-4"
          label="Kapital berechnen"
          onClick={handleSubmit}
        />
      }
      className="md:w-25rem"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fixedRate">Monatlich benötigter Betrag:</label>
          <InputNumber
            className="w-full"
            inputId="fixedRate"
            value={monthlyRate}
            onValueChange={(e) => setMonthlyRate(e.value ?? 0)}
            mode="currency"
            currency="EUR"
            locale="de-DE"
          />
        </div>
        <div>
          <label htmlFor="years">Bedarfsszeitraum (in Jahren):</label>
          <InputNumber
            className="w-full"
            inputId="years"
            value={years}
            onValueChange={handleYearsChange}
            min={1}
            max={100}
          />
        </div>
        <div>
          <label htmlFor="interest">Kapitalverzinsung (% pro Jahr):</label>
          <InputNumber
            className="w-full"
            inputId="interest"
            value={interestRate}
            onValueChange={handleInterestRateChange}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={5}
            step={0.25}
            min={0}
            max={100}
            suffix="%"
            locale="de-DE"
          />
        </div>
      </div>
      {results && (
        <div className="flex justify-center">
          <div className="mt-4 w-1/2 p-4 bg-stone-200 rounded-lg shadow">
            <p className="text-lg font-semibold text-center text-blue-600">
              {results}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default NecessaryWealthForm;
