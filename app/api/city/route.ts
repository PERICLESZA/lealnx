import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const cities = await prisma.city.findMany();
    return new Response(JSON.stringify(cities), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar cidades' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name_city } = await req.json();

  try {
    const newCity = await prisma.city.create({
      data: {
        name_city,
      },
    });
    return new Response(JSON.stringify(newCity), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao criar cidade' }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { idcity, name_city } = await req.json();

  try {
    const updatedCity = await prisma.city.update({
      where: { idcity },
      data: { name_city },
    });
    return new Response(JSON.stringify(updatedCity), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar cidade' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { idcity } = await req.json();

  try {
    await prisma.city.delete({
      where: { idcity },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir cidade' }), { status: 500 });
  }
}
