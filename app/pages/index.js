'use client';
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userNameDisplay, setUserNameDisplay] = useState('');
  const [showToast, setShowToast] = useState(false);  // Controla a exibição do Toast
  const [toastMessage, setToastMessage] = useState('');  // Mensagem a ser exibida
  const [toastType, setToastType] = useState('');  // Tipo da mensagem (sucesso ou erro)

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/login?username=${username}&password=${password}`);
      const data = await response.json();

      if (response.ok) {
        setLoginSuccess(true);
        setError('');
        setUserNameDisplay(data.nome);
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

    // Remover o toast após 3 segundos
    setTimeout(() => {
      setShowToast(true);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>Login</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Cabeçalho */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex justify-between items-center z-10">
        <h1 className="text-3xl font-bold">Luna Travel</h1>
        {loginSuccess && <span className="text-lg">{userNameDisplay}</span>}
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
            {error && <p className="text-red-500 text-center">{error}</p>}
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
