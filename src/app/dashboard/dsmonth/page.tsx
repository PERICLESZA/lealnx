"use client";

import { useEffect, useState } from "react";

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

  if (!data) return <p className="text-center mt-8 text-gray-600">Loading...</p>;

  const dbNames: Record<string, string> = {
    cedroibr: "Leal",
    cedroibr2: "Leal Filial",
    cedroibr3: "MB",
    cedroibr4: "Leal4",
  };

  const formatCurrency = (value: number) =>
    "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalGeral = Object.values(data.monthlySums).reduce((a, b) => a + b, 0);

  // ✅ Use os meses do backend para o cabeçalho, já ordenados corretamente
  const monthsToShow = [...data.months];
  console.log(data);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Monthly Financial</h2>

      {/* 🔹 Filtro */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
        className="flex flex-wrap gap-4 mb-6 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Start date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          Filter
        </button>
      </form>

      {/* 🔹 Relatório */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div
          className="w-full overflow-x-scroll border rounded-lg"
          style={{
            maxWidth: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table className="min-w-[1200px] border text-sm text-center border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2 font-semibold text-gray-700">Loja</th>
                {monthsToShow.map((m) => {
                  const [year, month] = m.split("-").map(Number);
                  const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
                  return (
                    <th key={m} className="border px-3 py-2 font-semibold text-gray-700">
                      {monthName}
                    </th>
                  );
                })}
                <th className="border px-3 py-2 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(data.totalsByBank).map(([store, monthly]) => {
                const total = Object.values(monthly).reduce((a, b) => a + b, 0);
                return (
                  <tr key={store} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-medium text-gray-800">
                      {dbNames[store] || store}
                    </td>
                    {monthsToShow.map((m) => (
                      <td key={m} className="border px-3 py-2">
                        {"$" + (Number(monthly[m] ?? 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    ))}
                    <td className="border px-3 py-2 font-semibold text-gray-800">
                      {"$" + total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td className="border px-3 py-2 text-gray-800">Total Geral</td>
                {monthsToShow.map((m) => (
                  <td key={m} className="border px-3 py-2 text-gray-800">
                    {formatCurrency(data.monthlySums[m] ?? 0)}
                  </td>
                ))}
                <td className="border px-3 py-2 text-gray-800">{formatCurrency(totalGeral)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
