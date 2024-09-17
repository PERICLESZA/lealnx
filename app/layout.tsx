// 'use client'
// app/layout.tsx
import { ReactNode } from 'react';
import '../app/styles/globals.css'; // Certifique-se de importar seu CSS global aqui
import type { AppProps } from 'next/app';
import { AuthProvider } from '../app/context/Autocontext';

export const metadata = {
  title: 'Minha Aplicação',
  description: 'Descrição da minha aplicação',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
    <html lang="pt-BR">
      <body>
        <div className="flex flex-col min-h-screen bg-gray-100">
          {/* Cabeçalho */}
          <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex items-center z-10">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold flex-shrink-0">Luna Travel</h1>
            </div>
            {/* O menu pode ser renderizado aqui ou em outro componente */}
          </header>

          {/* Conteúdo principal */}
          <main className="flex-grow mt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
    </AuthProvider>
  );
}
