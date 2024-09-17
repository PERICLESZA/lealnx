// app/components/Layout.tsx
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../context/Autocontext'; // Importe o contexto de autenticação

const Header = () => {
  const { user } = useAuth(); // Obtém o usuário do contexto
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex items-center z-10">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold flex-shrink-0">Luna Travel</h1>
        </div>
        <div className="ml-auto text-lg">
            {user ? <span>Bem-vindo, {user}!</span> : <span>Não autenticado</span>}
        </div>
        {/* O menu pode ser renderizado aqui ou em outro componente */}
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow mt-16">
        {children}
      </main>
    </div>
    </AuthProvider>
  );
};

export default Layout;
