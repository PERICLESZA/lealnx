"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Identification {
  ididentification: number;
  nameidentification: string | null;
}

export default function IdentificationPage() {
  const [identifications, setIdentifications] = useState<Identification[]>([]);
  const [newIdentification, setNewIdentification] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  async function loadIdentifications() {
    const res = await fetch("/api/identification");
    const data = await res.json();
    setIdentifications(data);
  }

  useEffect(() => {
    loadIdentifications();
  }, []);

  async function addIdentification() {
    if (!newIdentification.trim()) return;
    await fetch("/api/identification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameidentification: newIdentification }),
    });
    toast.success("Added successfully!");
    setNewIdentification("");
    loadIdentifications();
  }

  async function saveIdentification() {
    if (!editingId) return;
    await fetch("/api/identification", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ididentification: editingId,
        nameidentification: editingName,
      }),
    });
    toast.success("Updated successfully!");
    setEditingId(null);
    loadIdentifications();
  }

  async function deleteIdentification(ididentification: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    await fetch("/api/identification", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ididentification }),
    });
    toast.success("Deleted successfully!");
    loadIdentifications();
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md overflow-x-auto">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Identifications</h1>

      {/* Add new */}
      <label className="text-sm block mb-1 font-semibold">
        Add New Identification:
      </label>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Identification Name"
          value={newIdentification}
          onChange={(e) => setNewIdentification(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={addIdentification}
          className="bg-[#336699] text-white px-4 py-2 rounded hover:bg-[rgb(79,116,152)]"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 w-20">Edit</th>
            <th className="border px-2 py-1 w-20">ID</th>
            <th className="border px-2 py-1">Identification Name</th>
            <th className="border px-2 py-1 w-20">Del</th>
          </tr>
        </thead>
        <tbody>
          {identifications.map((i) => (
            <tr key={i.ididentification}>
              <td className="border text-center">
                {editingId === i.ididentification ? (
                  <>
                    <button
                      onClick={saveIdentification}
                      className="text-green-600 font-bold mr-2"
                      title="Save"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600"
                      title="Cancel"
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(i.ididentification);
                      setEditingName(i.nameidentification ?? "");
                    }}
                    className="text-orange-600"
                  >
                    ✏️
                  </button>
                )}
              </td>

              <td className="border text-center">{i.ididentification}</td>

              <td className="border text-center">
                {editingId === i.ididentification ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    autoFocus
                  />
                ) : (
                  i.nameidentification
                )}
              </td>

              <td className="border text-center">
                <button
                  onClick={() => deleteIdentification(i.ididentification)}
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
