"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { authClient } from "@/lib/auth-client";

interface City {
  idcity: number;
  name_city: string | null;
}

export default function CityPage() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [newCity, setNewCity] = useState("");
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: session, error } = await authClient.getSession();
        if (error || !session?.user) {
          router.push("/");
          return;
        }
        setUser(session.user);
        await loadCities();
      } catch (err) {
        console.error("Auth error:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function loadCities() {
    const res = await fetch("/api/city");
    const data = await res.json();
    setCities(data);
  }

  async function addCity() {
    if (!newCity.trim()) return;
    await fetch("/api/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_city: newCity }),
    });
    toast.success("City added successfully!");
    setNewCity("");
    loadCities();
  }

  async function saveCity() {
    if (!editingCity) return;
    await fetch("/api/city", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingCity),
    });
    toast.success("City updated successfully!");
    setEditingCity(null);
    loadCities();
  }

  async function deleteCity(idcity: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this city?");
    if (!confirmDelete) return;

    await fetch("/api/city", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idcity }),
    });
    toast.info("City deleted successfully!");
    loadCities();
  }

  if (loading || !user) return null;

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md overflow-x-auto">
      <Toaster richColors position="top-right" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cities</h1>
        {user && (
          <p className="text-sm text-gray-600">
            Logged in as <span className="font-semibold">{user.email}</span>
          </p>
        )}
      </div>

      <label className="text-sm block mb-1 font-semibold">City name:</label>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Type the city name"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={addCity}
          className="bg-[#336699] text-white px-4 py-2 rounded hover:bg-[rgb(79,116,152)]"
        >
          Add City
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 w-20">Edit</th>
            <th className="border px-2 py-1 w-20">ID</th>
            <th className="border px-2 py-1">City name</th>
            <th className="border px-2 py-1 w-20">Del</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((c) => (
            <tr key={c.idcity}>
              <td className="border text-center">
                {editingCity?.idcity === c.idcity ? (
                  <>
                    <button
                      onClick={saveCity}
                      className="text-green-600 font-bold mr-2"
                      title="Save"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setEditingCity(null)}
                      className="text-gray-600"
                      title="Cancel"
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingCity({ ...c })}
                    className="text-orange-600"
                  >
                    ✏️
                  </button>
                )}
              </td>

              <td className="border text-center">{c.idcity}</td>

              <td className="border text-center">
                {editingCity?.idcity === c.idcity ? (
                  <input
                    type="text"
                    value={editingCity.name_city ?? ""}
                    onChange={(e) =>
                      setEditingCity({ ...editingCity, name_city: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                    autoFocus
                  />
                ) : (
                  c.name_city
                )}
              </td>

              <td className="border text-center">
                <button
                  onClick={() => deleteCity(c.idcity)}
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
