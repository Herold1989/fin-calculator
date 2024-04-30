import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import useStore from "@/utils/WithdrawalStore/withdrawal-store";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";

interface WithdrawalCalculatorFormProps {
  wealth: number;
  interestRate: number;
  withdrawalShare: number;
  years?: number;
  startDate: Date;
}

const WithdrawalCalculatorForm = () => {
  const [wealth, setWealth] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [withdrawalShare, setWithdrawalShare] = useState<number>(100);
  const [years, setYears] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [results, setResults] = useState<string>("");
  const setPayments = useStore((state: any) => state.setPayments);
  const [fixedRate, setFixedRate] = useState<boolean>(true);
  const [fixedTime, setFixedTime] = useState<boolean>(false);
  const [monthlyRate, setMonthlyRate] = useState<number>(0); // State for the monthly rate input by the user

  const onOptionsChange = (e: RadioButtonChangeEvent, option: "wealth" | "time") => {
    // Ensure isChecked is always boolean by using `!!` to convert undefined or null to false
    const isChecked = !!e.checked;

    if (option === "wealth") {
      setFixedRate(isChecked);
      setFixedTime(!isChecked);
    } else if (option === "time") {
      setFixedTime(isChecked);
      setFixedRate(!isChecked);
    }
  };

  const handleWealthChange = (e: InputNumberValueChangeEvent) => {
    setWealth(e.value ?? 0);
  };

  const handleInterestRateChange = (e: InputNumberValueChangeEvent) => {
    setInterestRate(e.value ?? 0);
  };

  const handleWithdrawalShareChange = (e: InputNumberValueChangeEvent) => {
    setWithdrawalShare(e.value ?? 0);
  };

  const handleYearsChange = (e: InputNumberValueChangeEvent) => {
    setYears(e.value ?? 1);
  };

  const handleStartDateChange = (e: Date) => {
    setStartDate(e);
  };

  const calculateMonthlyWithdrawal = ({
    wealth,
    interestRate,
    years = 1,
    startDate,
    monthlyRateFixed, // Optional parameter if a fixed monthly rate is provided
  }: WithdrawalCalculatorFormProps & { monthlyRateFixed?: number }) => {
  
    if (!wealth || !interestRate || !years || !startDate) {
      throw new Error("Please ensure all fields are correctly filled out.");
    }
  
    const monthlyInterestRate = interestRate / 100 / 12;
    let monthlyPayment = 0; // Initialize monthly payment
    let numberOfPayments = 0; // Initialize the number of payments
    let paymentSchedule = []; // Initialize payment schedule
  
    if (monthlyRateFixed) {
      const interestGenerated = wealth * monthlyInterestRate;
      const principalWithdrawal = monthlyRateFixed - interestGenerated;

      if (principalWithdrawal <= 0) {
        const errorMessage = `Die gewählte monatliche Rate von €${monthlyRateFixed.toFixed(2)} ist nicht ausreichend, da sie nicht das Kapital reduziert. Bitte erhöhe die monatliche Auszahlung.`;
        setResults(errorMessage)
        throw new Error(errorMessage);
      }

      monthlyPayment = monthlyRateFixed;
      let remainingWealth = wealth;
      
      // Calculate how many payments until the wealth is depleted
      while (remainingWealth > 0) {
        remainingWealth -= principalWithdrawal; // Reduce wealth by the principal withdrawal each month
        numberOfPayments++;
        if (numberOfPayments > 1000) { // Safeguard against infinite loops
          throw new Error("Zu viele Zahlungen berechnet, bitte überprüfen Sie die Eingaben.");
        }
      }
  
    } else {
      numberOfPayments = years * 12; // Calculate the total number of payments based on the number of years
      // Calculate the annuity factor
      const annuityFactor = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      // Calculate the monthly payment required to reduce the initial wealth to zero over the specified period
      monthlyPayment = wealth * annuityFactor;
    }
  
    let remainingWealth = wealth;
    let currentDate = new Date(startDate);
  
    // Generate payment schedule using the correct number of payments
    for (let i = 1; i <= numberOfPayments && remainingWealth > 0; i++) {
      const interestIncome = remainingWealth * monthlyInterestRate;
      const principalWithdrawal = monthlyPayment - interestIncome;
      remainingWealth -= principalWithdrawal; // Decrease the remaining wealth by the principal withdrawal amount
  
      paymentSchedule.push({
        month: `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
        totalPayment: monthlyPayment,
        interestPayment: interestIncome,
        principalWithdrawal,
        remainingWealth: Math.max(0, remainingWealth), // Ensure that the remaining wealth doesn't go negative
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
      paymentDetails = calculateMonthlyWithdrawal({
        wealth,
        interestRate,
        withdrawalShare,
        startDate, // Notice years is not required here
        monthlyRateFixed: monthlyRate, // Pass the user-defined fixed monthly rate
      });

      // Adjust the results message to display the calculated time to withdraw the wealth
      const lastYearAndMonth = paymentDetails.paymentSchedule.slice(-1)[0];
      // Get the start month/year
      const startMonthAndYear = `${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`;

      // Find the difference between the last month/year in the payment schedule and the start date, save it in years and months
      const lastMonthAndYear = lastYearAndMonth.month;
      const lastMonth = parseInt(lastMonthAndYear.split("/")[0]);
      const lastYear = parseInt(lastMonthAndYear.split("/")[1]);
      const startMonth = parseInt(startMonthAndYear.split("/")[0]);
      const startYear = parseInt(startMonthAndYear.split("/")[1]);

      let years = lastYear - startYear;
      let months = lastMonth - startMonth;

      if (months < 0) {
        years--;
        months += 12;
      }

      setResults(
        `Entnahmezeitraum: ${years} Jahre und ${months} Monate bei einer monatlichen Entnahmerate von €${paymentDetails.monthlyPayment.toFixed(
          2
        )}`
      );
    } else {
      // Regular calculation when fixedRate is not selected
      paymentDetails = calculateMonthlyWithdrawal({
        wealth,
        interestRate,
        withdrawalShare,
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
      title="Entnahmerechner"
      subTitle="Berechne die regelmäßige Entnahmerate die zu Deinem Kapitalvermögen passt..."
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
          <RadioButton
              inputId="option1"
              value="Feste Entnahmerate"
              onChange={(e) => onOptionsChange(e, "wealth")}
              checked={fixedRate}
            />
            <label htmlFor="option1" className="ml-2">
              Feste Entnahmerate
            </label>
          </div>
          <div className="flex align-items-center">
            <RadioButton
              inputId="option2"
              value="Fester Entnahmezeitraum"
              onChange={(e) => onOptionsChange(e, "time")}
              checked={fixedTime}
            />
            <label htmlFor="option2" className="ml-2">
              Fester Entnahmezeitraum
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="wealth">Kapitalvermögen:</label>
          <InputNumber
            className="pl-4"
            inputId="wealth"
            value={wealth}
            onValueChange={handleWealthChange}
            mode="currency"
            currency="EUR"
            locale="de"
          />
        </div>
        <div>
          <label htmlFor="interest">Kapitalverzinsung (% pro Jahr):</label>
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
        <div>
          <label htmlFor="interest">Abschmelzungsrate (max. 100%):</label>
          <InputNumber
            className="pl-4"
            inputId="interest"
            value={withdrawalShare}
            onValueChange={handleWithdrawalShareChange}
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
            <label htmlFor="years">Entnahmezeitraum (in Jahren):</label>
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

export default WithdrawalCalculatorForm;
