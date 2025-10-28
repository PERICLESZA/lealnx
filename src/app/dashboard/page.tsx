'use client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState('2025-12-31')
  const [data, setData] = useState<any>({ totals: {}, grand_totals: {} })

  async function fetchData() {
    const res = await fetch(`/api/ds?start_date=${startDate}&end_date=${endDate}`)
    const json = await res.json()
    setData(json)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const nameMap: Record<string, string> = {
    DB1: 'Leal',
    DB2: 'Leal Filial',
    DB3: 'MB',
    DB4: 'Leal4',
    DB5: 'Cedroibr7',
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard Cashflow</h2>

      <div className="flex gap-4 mb-6">
        <label>
          Start date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border ml-2 p-1"
          />
        </label>
        <label>
          End date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border ml-2 p-1"
          />
        </label>
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <table className="w-full border text-center">
        <thead className="bg-gray-200">
          <tr>
            <th>Loja</th>
            <th>Value Flow</th>
            <th>Cents Flow</th>
            <th>Value Percent Flow</th>
            <th>Cents2 Flow</th>
            <th>Total Flow</th>
            <th>Total to Pay</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.totals).map(([key, val]: any) => (
            <tr key={key}>
              <td>{nameMap[key] ?? key}</td>
              <td>{val.valueflow}</td>
              <td>{val.centsflow}</td>
              <td>{val.valuepercentflow}</td>
              <td>{val.cents2flow}</td>
              <td>{val.totalflow}</td>
              <td>{val.totaltopay}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-bold">
          <tr>
            <td>Total Geral</td>
            <td>{data.grand_totals?.valueflow}</td>
            <td>{data.grand_totals?.centsflow}</td>
            <td>{data.grand_totals?.valuepercentflow}</td>
            <td>{data.grand_totals?.cents2flow}</td>
            <td>{data.grand_totals?.totalflow}</td>
            <td>{data.grand_totals?.totaltopay}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
