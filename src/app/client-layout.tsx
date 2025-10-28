"use client";

import { Sidebar } from "../components/sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/"; // Oculta a sidebar na página de login
  const [collapsed, setCollapsed] = useState(false); // controla o estado

  return (
    <div className={`antialiased ${showSidebar ? "flex" : ""} h-screen`}>
      {showSidebar && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      <main
        className={`flex-1 min-h-screen bg-zinc-100 p-6 transition-all duration-300
          ${showSidebar ? (collapsed ? "ml-16" : "ml-56") : ""}`}
      >
        {children}
      </main>
    </div>
  );
}
