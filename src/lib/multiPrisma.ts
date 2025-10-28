import { PrismaClient } from '@prisma/client'

type DbKeys = 'DB1' | 'DB2' | 'DB3' | 'DB4' | 'DB5'

const databases: Record<DbKeys, string | undefined> = {
  DB1: process.env.DB1_URL,
  DB2: process.env.DB2_URL,
  DB3: process.env.DB3_URL,
  DB4: process.env.DB4_URL,
  DB5: process.env.DB5_URL,
}

const clients: Partial<Record<DbKeys, PrismaClient>> = {}

for (const [key, url] of Object.entries(databases)) {
  if (!url) continue
  clients[key as DbKeys] = new PrismaClient({
    datasources: { db: { url } },
  })
}

export default clients
