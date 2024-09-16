'use client';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userNameDisplay, setUserNameDisplay] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [userProfile, setUserProfile] = useState(''); // Estado para o perfil do usuário
  const router = useRouter(); // Instancia o hook useRouter

  const menuOptions = {
    A: [
      "Exchange", "Bank", "City", "Class", "Country", "Customer",
      "Identification", "Login", "Parameter", "PercentCheck", "Status", "StoreIP", "Report", "Logout"
    ],
    U: ["Exchange", "City", "Country", "Customer", "Logout"]
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/login?username=${username}&password=${password}`);
      const data = await response.json();

      if (response.ok) {
        setLoginSuccess(true);
        setError('');
        setUserNameDisplay(data.nome);
        setUserProfile(data.perfil); // Define o perfil do usuário
        setToastMessage('Autenticação bem-sucedida!');
        setToastType('success');
      } else {
        setLoginSuccess(false);
        setError(data.error || 'Erro ao autenticar');
        setUserNameDisplay('');
        setToastMessage('Erro na autenticação.');
        setToastType('error');
      }
    } catch (error) {
      setLoginSuccess(false);
      setError('Erro ao autenticar');
      setUserNameDisplay('');
      setToastMessage('Erro na autenticação.');
      setToastType('error');
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false); // Corrigido para ocultar o toast após 3 segundos
    }, 3000);
  };

  const handleMenuChange = (e) => {
    const selectedOption = e.target.value;

    if (selectedOption === "Logout") {
      // Limpa o estado de autenticação
      setLoginSuccess(false);
      setUserNameDisplay('');
      setUserProfile('');
      setUsername('');
      setPassword('');
      setToastMessage('Logout realizado com sucesso!');
      setToastType('success');
      
      // Redireciona o usuário para a página de login ou outra página
      // router.push('/login'); // Altere para a rota que desejar
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>Login</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Cabeçalho */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex items-center z-10">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold flex-shrink-0">Luna Travel</h1>
        </div>
        {loginSuccess && userProfile && (
          <div className="flex-1 flex justify-center">
            <div className="bg-white text-black rounded-md shadow-md">
              <select
                className="bg-gray-100 text-black rounded-md p-2"
                onChange={handleMenuChange} // Atualizado para usar handleMenuChange
              >
                {menuOptions[userProfile].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <span className="flex-shrink-0 text-lg text-right">{loginSuccess ? userNameDisplay : ''}</span>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow flex items-center justify-center mt-16">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu usuário"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>

      {showToast && (
        <div className={`fixed top-20 right-5 px-4 py-2 rounded-lg text-white shadow-lg transition-opacity ease-in-out duration-1000
          ${showToast ? 'opacity-100 visible' : 'opacity-0 invisible'} 
          ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
