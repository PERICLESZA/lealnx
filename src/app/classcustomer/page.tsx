"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface ClassCustomer {
  idclasscustomer: number;
  description: string | null;
  seeincompany: boolean | null;
}

export default function ClassCustomerPage() {
  const [classes, setClasses] = useState<ClassCustomer[]>([]);
  const [newClass, setNewClass] = useState({ description: "", seeincompany: false });
  const [editingClass, setEditingClass] = useState<ClassCustomer | null>(null);

  async function loadClasses() {
    const res = await fetch("/api/classcustomer");
    const data = await res.json();
    setClasses(data);
  }

  useEffect(() => {
    loadClasses();
  }, []);

  async function addClass() {
    if (!newClass.description.trim()) return;
    await fetch("/api/classcustomer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClass),
    });
    toast.success("Added successfully!");
    setNewClass({ description: "", seeincompany: false });
    loadClasses();
  }

  async function saveClass() {
    if (!editingClass) return;
    await fetch("/api/classcustomer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingClass),
    });
    toast.success("Updated successfully!");
    setEditingClass(null);
    loadClasses();
  }

  async function deleteClass(idclasscustomer: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this class?");
    if (!confirmDelete) return;

    await fetch("/api/classcustomer", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idclasscustomer }),
    });
    toast.success("Deleted successfully!");
    loadClasses();
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md overflow-x-auto">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Customer Classes</h1>

      <label className="text-sm block mb-1 font-semibold">Class Information:</label>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Description"
          value={newClass.description}
          onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={newClass.seeincompany}
            onChange={(e) => setNewClass({ ...newClass, seeincompany: e.target.checked })}
          />
          See in company
        </label>
        <button
          onClick={addClass}
          className="bg-[#336699] text-white px-4 py-2 rounded hover:bg-[rgb(79,116,152)]"
        >
          Add Class
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 w-20">Edit</th>
            <th className="border px-2 py-1 w-20">ID</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">See in company</th>
            <th className="border px-2 py-1 w-20">Del</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.idclasscustomer}>
              <td className="border text-center">
                {editingClass?.idclasscustomer === c.idclasscustomer ? (
                  <>
                    <button
                      onClick={saveClass}
                      className="text-green-600 font-bold mr-2"
                      title="Save"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setEditingClass(null)}
                      className="text-gray-600"
                      title="Cancel"
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingClass({ ...c })}
                    className="text-orange-600"
                  >
                    ✏️
                  </button>
                )}
              </td>

              <td className="border text-center">{c.idclasscustomer}</td>

              <td className="border text-center">
                {editingClass?.idclasscustomer === c.idclasscustomer ? (
                  <input
                    type="text"
                    value={editingClass.description ?? ""}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, description: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                    autoFocus
                  />
                ) : (
                  c.description
                )}
              </td>

              <td className="border text-center">
                {editingClass?.idclasscustomer === c.idclasscustomer ? (
                  <input
                    type="checkbox"
                    checked={!!editingClass.seeincompany}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, seeincompany: e.target.checked })
                    }
                  />
                ) : c.seeincompany ? (
                  "✅"
                ) : (
                  "❌"
                )}
              </td>

              <td className="border text-center">
                <button
                  onClick={() => deleteClass(c.idclasscustomer)}
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
