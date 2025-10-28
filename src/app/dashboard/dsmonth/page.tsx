"use client";

import { useEffect, useState } from "react";

// 🔹 Definindo tipos para o retorno da API
interface DsMonthData {
  months: string[];
  totalsByBank: Record<string, Record<string, number>>;
  monthlySums: Record<string, number>;
}

export default function DsMonthPage() {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [data, setData] = useState<DsMonthData | null>(null);

  async function fetchData() {
    const res = await fetch(`/api/dsmonth?start_date=${startDate}&end_date=${endDate}`);
    const json: DsMonthData = await res.json();
    setData(json);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  // 🔹 Nome das lojas (bancos)
  const dbNames: Record<string, string> = {
    cedroibr: "Leal",
    cedroibr2: "Leal Filial",
    cedroibr3: "MB",
    cedroibr4: "Leal4",
  };

  // 🔹 Formata valores monetários
  const formatCurrency = (value: number) =>
    "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // 🔹 Soma total geral — agora tipado
  const totalGeral = Object.values(data.monthlySums).reduce((a, b) => a + b, 0);

  // Transformando startDate e endDate em objetos Date
  const start = new Date(startDate);
const end = new Date(endDate);

// Filtra meses dentro do intervalo e ordena cronologicamente
const sortedMonths = data.months
  .map(m => new Date(m + "-01"))            // transforma cada mês em Date
  .filter(d => d >= start && d <= end)      // filtra pelo intervalo
  .sort((a, b) => a.getTime() - b.getTime()) // ordena do menor para maior
  .map(d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); // volta ao formato YYYY-MM

  console.log(data.months)

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Monthly Financial</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
        className="flex gap-4 mb-6"
      >
        <label>
          Start date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1 ml-2"
          />
        </label>
        <label>
          End date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1 ml-2"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-center">
      <thead className="bg-gray-100">
            <tr>
                <th>Loja</th>
                {sortedMonths.map((m) => (
                <th key={m}>{new Date(`${m}-01`).toLocaleString("en", { month: "short" })}</th>
                ))}
                <th>Total</th>
            </tr>
            </thead>

            <tbody>
            {Object.entries(data.totalsByBank).map(([db, values]) => {
                const total = Object.values(values).reduce((a, b) => a + b, 0);
                return (
                <tr key={db} className="border-t">
                    <td className="font-semibold">{dbNames[db] || db}</td>
                    {sortedMonths.map((m) => (
                    <td key={m}>{formatCurrency(values[m] || 0)}</td>
                    ))}
                    <td className="font-semibold">{formatCurrency(total)}</td>
                </tr>
                );
            })}
            </tbody>

            <tfoot className="bg-gray-100 font-bold">
            <tr>
                <td>Total Geral</td>
                {sortedMonths.map((m) => (
                <td key={m}>{formatCurrency(data.monthlySums[m] || 0)}</td>
                ))}
                <td>{formatCurrency(totalGeral)}</td>
            </tr>
            </tfoot>
        </table>
      </div>
    </div>
  );
}
