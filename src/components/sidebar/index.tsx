"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  Home,
  BarChart3,
  RefreshCcw,
  Banknote,
  Building,
  Users,
  User,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Logout realizado com sucesso!");
      router.replace("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      toast.error("Erro ao sair da conta!");
    }
  }

  const menuItems = [
    { href: "/overview", label: "Overview", icon: <Home size={18} /> },
    { href: "/dashboard/dsmonth", label: "Monthly Overview", icon: <BarChart3 size={18} /> },
    { href: "/exchange", label: "Exchange", icon: <RefreshCcw size={18} /> },
    { href: "/bank", label: "Bank", icon: <Banknote size={18} /> },
    { href: "/city", label: "City", icon: <Building size={18} /> },
    { href: "/classcustomer", label: "Class Customer", icon: <Users size={18} /> },
    { href: "/customer", label: "Customer", icon: <User size={18} /> },
    { href: "/identification", label: "Identification", icon: <User size={18} /> },
    { href: "/user", label: "User", icon: <User size={18} /> },
    { href: "/report", label: "Report", icon: <FileText size={18} /> },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#336699] text-white flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}`}
    >
      {/* Cabeçalho da Sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!collapsed && <span className="text-lg font-bold">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-[#2a547d] transition"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1 p-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2a547d] transition"
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}

                {/* Tooltip visível apenas quando retraído */}
                {collapsed && (
                  <span
                    className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black text-xs text-white 
                    opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition"
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Usuário Logado */}
      <div className="border-t border-zinc-700 p-4 flex items-center gap-3 relative group">
        {/* Avatar do usuário */}
        <div className="w-8 h-8 rounded-full bg-zinc-400 flex items-center justify-center text-zinc-800 font-bold">
          {session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
        </div>

        {/* Nome e e-mail (quando expandido) */}
        {!collapsed && (
          <div className="flex-1">
            {isPending ? (
              <p className="text-sm text-zinc-300">Carregando...</p>
            ) : session?.user ? (
              <>
                <p className="text-sm font-semibold truncate">{session.user.name}</p>
                <p className="text-xs text-zinc-300 truncate">{session.user.email}</p>
              </>
            ) : (
              <p className="text-sm text-zinc-300">Usuário não logado</p>
            )}
          </div>
        )}

        {/* Tooltip quando retraído */}
        {collapsed && session?.user && (
          <div
            className="absolute left-full ml-2 px-3 py-2 rounded-md bg-black text-xs text-white 
            opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition"
          >
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-zinc-300">{session.user.email}</p>
          </div>
        )}
      </div>

      {/* Rodapé (Logout) */}
      <div className="border-t border-zinc-800 p-4">
        <button
          onClick={handleLogout}
          className="relative group flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-[#2a547d] transition text-left"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}

          {/* Tooltip no botão de logout também */}
          {collapsed && (
            <span
              className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black text-xs text-white 
              opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition"
            >
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
