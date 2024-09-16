import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idlogin = url.searchParams.get('idlogin');
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');

    if (idlogin) {
      // Buscar um login específico pelo ID
      const login = await prisma.login.findUnique({
        where: { idlogin: Number(idlogin) },
      });

      if (login) {
        return new Response(JSON.stringify(login), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Login não encontrado' }), { status: 404 });
      }
    } else if (username && password) {
      // Buscar um login específico pelo nome de usuário e senha
      const login = await prisma.login.findFirst({
        where: {
          login: username,
          senha: password,
        },
      });

      if (login) {
        return new Response(JSON.stringify(login), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Usuário ou senha incorretos' }), { status: 404 });
      }
    } else {
      // Buscar todos os logins se nenhum ID ou credenciais forem fornecidos
      const logins = await prisma.login.findMany();
      return new Response(JSON.stringify(logins), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar logins' }), { status: 500 });
  }
}


export async function POST(req: Request) {
  const { login, senha, nome, email, perfil, active } = await req.json();

  try {
    const newLogin = await prisma.login.create({
      data: {
        login,
        senha,
        nome,
        email,
        perfil,
        active,
      },
    });
    return new Response(JSON.stringify(newLogin), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao criar login' }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { idlogin, login, senha, nome, email, perfil, active } = await req.json();

  try {
    const updatedLogin = await prisma.login.update({
      where: { idlogin },
      data: { login, senha, nome, email, perfil, active },
    });
    return new Response(JSON.stringify(updatedLogin), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar login' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { idlogin } = await req.json();

  try {
    await prisma.login.delete({
      where: { idlogin },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir login' }), { status: 500 });
  }
}
