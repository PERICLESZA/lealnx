import clients from "@/lib/multiPrisma";
import { PrismaClient } from "@prisma/client";

export function getDbClient(pathname: string): PrismaClient {
  if (pathname.includes("/leal") && clients.DB1) return clients.DB1;
  if (pathname.includes("/leal_filial") && clients.DB2) return clients.DB2;
  if (pathname.includes("/md") && clients.DB3) return clients.DB3;
  if (pathname.includes("/leal4") && clients.DB4) return clients.DB4;
  if (clients.DB5) return clients.DB5;

  // Se nenhuma opção for válida, lance um erro explícito:
  throw new Error("Banco de dados não encontrado para esta rota");
}
