import Link from "next/link";
import { Button } from "primereact/button";

export default function Home() {
  return (
    <div className="mb-12 mt-28 sm:mt-16 flex flex-col items-center justify-center text-center">
      <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
        <span className="text-[#FFA500]">Finanzrechner:</span> Dein Weg zur
        finanziellen Freiheit.
      </h1>
      <div className="mt-16 items-center justify-center text-center">
        <Button severity="info">
          <Link href="/annuity" className="p-button font-bold">
            Annuitätenrechner
          </Link>
        </Button>
      </div>
      <div className="mt-4 items-center justify-center text-center">
        <Button severity="info">
          <Link href="/withdrawal" className="p-button font-bold">
            Entnahmerechner
          </Link>
        </Button>
      </div>
    </div>
  );
}
