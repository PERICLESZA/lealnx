"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Bank {
  idbank: number;
  namebank: string;
  agency: string;
  count: string;
}

export default function BankPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [newBank, setNewBank] = useState({ namebank: "", agency: "", count: "" });
  const [editingBank, setEditingBank] = useState<Bank | null>(null);

  async function loadBanks() {
    const res = await fetch("/api/bank");
    const data = await res.json();
    setBanks(data);
  }

  useEffect(() => {
    loadBanks();
  }, []);

  async function addBank() {
    if (!newBank.namebank.trim()) return;
    await fetch("/api/bank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBank),
    });
    toast.success("Added successfully!");
    setNewBank({ namebank: "", agency: "", count: "" });
    loadBanks();
  }

  async function saveBank() {
    if (!editingBank) return;
    await fetch("/api/bank", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBank),
    });
    toast.success("Updated successfully!");
    setEditingBank(null);
    loadBanks();
  }

  async function deleteBank(idbank: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this bank?");
    if (!confirmDelete) return;

    await fetch("/api/bank", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idbank }),
    });
    toast.success("Deleted successfully!");
    loadBanks();
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md overflow-x-auto">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Banks</h1>

      <label className="text-sm block mb-1 font-semibold">Bank Information:</label>
      <div className="mb-4 grid grid-cols-4 gap-2">
        <input
          type="text"
          placeholder="Bank Name"
          value={newBank.namebank}
          onChange={(e) => setNewBank({ ...newBank, namebank: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Agency"
          value={newBank.agency}
          onChange={(e) => setNewBank({ ...newBank, agency: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Count"
          value={newBank.count}
          onChange={(e) => setNewBank({ ...newBank, count: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={addBank}
          className="bg-[#336699] text-white px-4 py-2 rounded hover:bg-[rgb(79,116,152)]"
        >
          Add Bank
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 w-20">Edit</th>
            <th className="border px-2 py-1 w-20">ID</th>
            <th className="border px-2 py-1">Bank Name</th>
            <th className="border px-2 py-1">Agency</th>
            <th className="border px-2 py-1">Count</th>
            <th className="border px-2 py-1 w-20">Del</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b) => (
            <tr key={b.idbank}>
              <td className="border text-center">
                {editingBank?.idbank === b.idbank ? (
                  <>
                    <button
                      onClick={saveBank}
                      className="text-green-600 font-bold mr-2"
                      title="Save"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setEditingBank(null)}
                      className="text-gray-600"
                      title="Cancel"
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingBank({ ...b })}
                    className="text-orange-600"
                  >
                    ✏️
                  </button>
                )}
              </td>

              <td className="border text-center">{b.idbank}</td>

              <td className="border text-center">
                {editingBank?.idbank === b.idbank ? (
                  <input
                    type="text"
                    value={editingBank.namebank}
                    onChange={(e) =>
                      setEditingBank({ ...editingBank, namebank: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                    autoFocus
                  />
                ) : (
                  b.namebank
                )}
              </td>

              <td className="border text-center">
                {editingBank?.idbank === b.idbank ? (
                  <input
                    type="text"
                    value={editingBank.agency}
                    onChange={(e) =>
                      setEditingBank({ ...editingBank, agency: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  b.agency
                )}
              </td>

              <td className="border text-center">
                {editingBank?.idbank === b.idbank ? (
                  <input
                    type="text"
                    value={editingBank.count}
                    onChange={(e) =>
                      setEditingBank({ ...editingBank, count: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  b.count
                )}
              </td>

              <td className="border text-center">
                <button
                  onClick={() => deleteBank(b.idbank)}
                  className="text-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
