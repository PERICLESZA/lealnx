import { prisma } from "./prisma";
import { hash } from "bcryptjs";

async function testeHash() {
  const user = await prisma.login.findFirst({ where: { login: "pericles1011" } });
  if (user) {
    const hashed = await hash("sua_senha", 10);
    await prisma.login.update({
      where: { idlogin: user.idlogin },
      data: { senha: hashed },
    });
    console.log("Senha atualizada com hash");
  }
}
testeHash();
