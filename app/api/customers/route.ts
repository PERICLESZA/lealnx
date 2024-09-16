import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const customers = await prisma.customer.findMany();
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar clientes' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, email, phone, fk_idcountry, createAt, updateAt } = await req.json();

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        fk_idcountry,
        createAt, 
        updateAt,
      },
    });
    return new Response(JSON.stringify(newCustomer), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { idcustomer, name, email, phone } = await req.json();

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { idcustomer },
      data: { name, email, phone },
    });
    return new Response(JSON.stringify(updatedCustomer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar cliente' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { idcustomer } = await req.json();

  try {
    await prisma.customer.delete({
      where: { idcustomer },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir cliente' }), { status: 500 });
  }
}
