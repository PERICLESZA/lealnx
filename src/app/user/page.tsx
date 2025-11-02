"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Login {
  idlogin: number;
  login: string;
  senha: string | null;
  nome: string | null;
  celular: string;
  email: string | null;
  perfil: string | null;
  active: string | null;
  token: string;
  excluido: number;
}

export default function LoginPage() {
  const [logins, setLogins] = useState<Login[]>([]);
  const [newLogin, setNewLogin] = useState<Partial<Login>>({
    login: "",
    senha: "",
    nome: "",
    celular: "",
    email: "",
    perfil: "",
    active: "S",
    token: "",
    excluido: 0,
  });
  const [editingLogin, setEditingLogin] = useState<Login | null>(null);

  async function loadLogins() {
    const res = await fetch("/api/user");
    const data = await res.json();
    setLogins(data);
  }

  useEffect(() => {
    loadLogins();
  }, []);

  async function addLogin() {
    if (!newLogin.login?.trim() || !newLogin.celular?.trim()) {
      toast.error("Login e celular são obrigatórios!");
      return;
    }

    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLogin),
    });
    toast.success("Added successfully!");
    setNewLogin({
      login: "",
      senha: "",
      nome: "",
      celular: "",
      email: "",
      perfil: "",
      active: "S",
      token: "",
      excluido: 0,
    });
    loadLogins();
  }

  async function saveLogin() {
    if (!editingLogin) return;
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingLogin),
    });
    toast.success("Updated successfully!");
    setEditingLogin(null);
    loadLogins();
  }

  async function deleteLogin(idlogin: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this login?");
    if (!confirmDelete) return;

    await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idlogin }),
    });
    toast.success("Deleted successfully!");
    loadLogins();
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md overflow-x-auto">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Logins</h1>

      {/* Add new */}
      <label className="text-sm block mb-1 font-semibold">Add New Login:</label>
      <div className="mb-4 grid grid-cols-7 gap-2">
        <input
          type="text"
          placeholder="Login"
          value={newLogin.login}
          onChange={(e) => setNewLogin({ ...newLogin, login: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Senha"
          value={newLogin.senha || ""}
          onChange={(e) => setNewLogin({ ...newLogin, senha: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Nome"
          value={newLogin.nome || ""}
          onChange={(e) => setNewLogin({ ...newLogin, nome: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Celular"
          value={newLogin.celular || ""}
          onChange={(e) => setNewLogin({ ...newLogin, celular: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Email"
          value={newLogin.email || ""}
          onChange={(e) => setNewLogin({ ...newLogin, email: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Perfil"
          value={newLogin.perfil || ""}
          onChange={(e) => setNewLogin({ ...newLogin, perfil: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={addLogin}
          className="bg-[#336699] text-white px-4 py-2 rounded hover:bg-[rgb(79,116,152)]"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Edit</th>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Login</th>
            <th className="border px-2 py-1">Nome</th>
            <th className="border px-2 py-1">Celular</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Perfil</th>
            <th className="border px-2 py-1">Active</th>
            <th className="border px-2 py-1">Del</th>
          </tr>
        </thead>
        <tbody>
          {logins.map((l) => (
            <tr key={l.idlogin}>
              <td className="border text-center">
                {editingLogin?.idlogin === l.idlogin ? (
                  <>
                    <button
                      onClick={saveLogin}
                      className="text-green-600 font-bold mr-2"
                      title="Save"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setEditingLogin(null)}
                      className="text-gray-600"
                      title="Cancel"
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingLogin({ ...l })}
                    className="text-orange-600"
                  >
                    ✏️
                  </button>
                )}
              </td>

              <td className="border text-center">{l.idlogin}</td>

              {["login", "nome", "celular", "email", "perfil", "active"].map((field) => (
                <td key={field} className="border text-center">
                  {editingLogin?.idlogin === l.idlogin ? (
                    <input
                      type="text"
                      value={(editingLogin as any)[field] || ""}
                      onChange={(e) =>
                        setEditingLogin({ ...editingLogin, [field]: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    (l as any)[field]
                  )}
                </td>
              ))}

              <td className="border text-center">
                <button onClick={() => deleteLogin(l.idlogin)} className="text-red-600">
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