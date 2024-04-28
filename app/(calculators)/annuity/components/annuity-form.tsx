import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import useStore from "@/utils/store";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

interface AnnuityCalculatorFormProps {
  loan: number;
  interestRate: number;
  years?: number;
  startDate: Date;
}

const AnnuityCalculatorForm = () => {
  const [loan, setLoan] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [years, setYears] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [results, setResults] = useState<string>("");
  const setPayments = useStore((state: any) => state.setPayments);
  const [fixedRate, setFixedRate] = useState<boolean>(true);
  const [fixedTime, setFixedTime] = useState<boolean>(false);
  const [monthlyRate, setMonthlyRate] = useState<number>(0); // State for the monthly rate input by the user

  const onOptionsChange = (e: CheckboxChangeEvent, option: "loan" | "time") => {
    // Ensure isChecked is always boolean by using `!!` to convert undefined or null to false
    const isChecked = !!e.checked;

    if (option === "loan") {
      setFixedRate(isChecked);
      setFixedTime(!isChecked);
    } else if (option === "time") {
      setFixedTime(isChecked);
      setFixedRate(!isChecked);
    }
  };

  const handleLoanChange = (e: InputNumberValueChangeEvent) => {
    setLoan(e.value ?? 0);
  };

  const handleInterestRateChange = (e: InputNumberValueChangeEvent) => {
    setInterestRate(e.value ?? 0);
  };

  const handleYearsChange = (e: InputNumberValueChangeEvent) => {
    setYears(e.value ?? 1);
  };

  // Implement the logic to handle the date change here, use the calender.d.ts file for reference if needed

  const handleStartDateChange = (e: Date) => {
    setStartDate(e);
  };

  const calculateMonthlyPayment = ({
    loan,
    interestRate,
    years = 1,
    startDate,
    monthlyRateFixed, // Added as an optional parameter to handle fixed rate logic
  }: AnnuityCalculatorFormProps & { monthlyRateFixed?: number }) => {
    if (!loan || !interestRate || !startDate) {
      throw new Error("Please ensure all fields are correctly filled out.");
    }

    const monthlyRate = interestRate / 100 / 12;
    let monthlyPayment = 0; // Default to zero
    let numberOfPayments = 0; // Default to zero
    let paymentSchedule = []; // Always initialize

    if (monthlyRateFixed) {
      const minimumPrincipalPayment = (loan * 0.01) / 12; // 1% p.a. of the loan as the minimum principal payment
      const minimumRequiredPayment =
        loan * monthlyRate + minimumPrincipalPayment;

      if (monthlyRateFixed < minimumRequiredPayment) {
        setResults(
          `The fixed monthly rate of €${monthlyRateFixed.toFixed(
            2
          )} is too low. It must be at least €${minimumRequiredPayment.toFixed(
            2
          )} to cover the interest and principal.`
        );
        throw new Error(
          `The fixed monthly rate is too low. Minimum required is €${minimumRequiredPayment.toFixed(
            2
          )}.`
        );
      }

      monthlyPayment = monthlyRateFixed;
      numberOfPayments = Math.ceil(
        loan / (monthlyRateFixed - loan * monthlyRate)
      );
    } else {
      numberOfPayments = years * 12;
      const annuityFactor =
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      monthlyPayment = loan * annuityFactor;
    }

    let remainingLoan = loan;
    let currentDate = new Date(startDate);

    for (let i = 1; i <= numberOfPayments && remainingLoan > 0; i++) {
      const interestPayment = remainingLoan * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingLoan -= principalPayment;
      paymentSchedule.push({
        month: `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
        totalPayment: monthlyPayment,
        interestPayment,
        principalPayment,
        remainingLoan: remainingLoan < 0 ? 0 : remainingLoan,
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      monthlyPayment,
      numberOfPayments,
      paymentSchedule,
    };
  };

  const handleSubmit = () => {
    let paymentDetails;

    if (fixedRate) {
      // When fixedRate is true, calculate based on the monthlyRate entered by the user
      paymentDetails = calculateMonthlyPayment({
        loan,
        interestRate,
        startDate, // Notice years is not required here
        monthlyRateFixed: monthlyRate, // Pass the user-defined fixed monthly rate
      });
      
      // Adjust the results message to display the calculated time to repay the loan
      const lastYearAndMonth = paymentDetails.paymentSchedule.slice(-1)[0];
      // Get the start month/year
      const startMonthAndYear = `${startDate.getMonth() + 1}/${startDate.getFullYear()}`;      
      console.log(startMonthAndYear);

      // Find the difference between the last month/year in the payment schedule and the start date, save it in years and months
      const lastMonthAndYear = lastYearAndMonth.month;
      const lastMonth = parseInt(lastMonthAndYear.split('/')[0]);
      const lastYear = parseInt(lastMonthAndYear.split('/')[1]);
      const startMonth = parseInt(startMonthAndYear.split('/')[0]);
      const startYear = parseInt(startMonthAndYear.split('/')[1]);

      let years  = lastYear - startYear;
      let months = lastMonth - startMonth;

      if (months < 0) {
        years--;
        months += 12;
      }

      console.log(`Years: ${years}, Months: ${months}`);

      setResults(
        `Rückzahlungszeitraum: ${years} Jahre und ${months} Monate bei einer monatlichen Rate von €${paymentDetails.monthlyPayment.toFixed(
          2
        )}`
      );
    } else {
      // Regular calculation when fixedRate is not selected
      paymentDetails = calculateMonthlyPayment({
        loan,
        interestRate,
        years,
        startDate,
      });
      setResults(
        `Die monatliche Rate beträgt: €${paymentDetails.monthlyPayment.toFixed(
          2
        )}`
      );
    }

    setPayments(paymentDetails.paymentSchedule); // Update payment schedule
  };

  return (
    <Card
      title="Annuitätenrechner"
      subTitle="Gib Deine Kreditdetails ein..."
      footer={
        <Button
          className="mt-4"
          label="Rate berechnen"
          onClick={handleSubmit}
        />
      }
      className="md:w-25rem"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap justify-content-center gap-3">
          <div className="flex align-items-center">
            <Checkbox
              inputId="option1"
              checked={fixedRate}
              onChange={(e) => onOptionsChange(e, "loan")}
              value="loan"
            />
            <label htmlFor="option1" className="ml-2">
              Feste Kreditrate
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="option2"
              checked={fixedTime}
              onChange={(e) => onOptionsChange(e, "time")}
              value="time"
            />
            <label htmlFor="option2" className="ml-2">
              Fester Rückzahlungszeitraum
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="loan">Kreditbetrag:</label>
          <InputNumber
            className="pl-4"
            inputId="loan"
            value={loan}
            onValueChange={handleLoanChange}
            mode="currency"
            currency="EUR"
            locale="de"
          />
        </div>
        <div>
          <label htmlFor="interest">Zinssatz (% pro Jahr):</label>
          <InputNumber
            className="pl-4"
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
        {fixedRate && (
          <div>
            <label htmlFor="fixedRate">Feste monatliche Rate:</label>
            <InputNumber
              className="pl-4"
              inputId="fixedRate"
              value={monthlyRate}
              onValueChange={(e) => setMonthlyRate(e.value ?? 0)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
            />
          </div>
        )}
        {fixedTime && (
          <div>
            <label htmlFor="years">Rückzahlungszeitraum (in Jahren):</label>
            <InputNumber
              className="pl-4"
              inputId="years"
              value={years}
              onValueChange={handleYearsChange}
              min={1}
              max={100}
            />
          </div>
        )}
        <div>
          <label htmlFor="start-date">Startdatum:</label>
          <Calendar
            className="pl-4"
            id="start-date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.value as Date)}
            dateFormat="mm/yy"
            view="month"
            yearNavigator
            yearRange="2020:2030"
          />
        </div>
        <div>
          <p>{results}</p>
        </div>
      </div>
    </Card>
  );
};

export default AnnuityCalculatorForm;
