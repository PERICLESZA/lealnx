// src/app/api/dsmonth/route.ts
import mysql from "mysql2/promise";

function generateMonths(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const months: string[] = [];
  while (s <= e) {
    const y = s.getFullYear();
    const m = String(s.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
    s.setMonth(s.getMonth() + 1);
  }
  return months;
}

function parseMysqlUrl(url: string) {
  // match more permissive: user can contain dots/underscores, password may have encoded chars
  const re = /^mysql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/(.+)$/;
  const match = url.match(re);
  if (!match) throw new Error(`URL inválida: ${url}`);
  const [, user, password, host, port, database] = match;
  return { user, password, host, port: Number(port), database };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("start_date") || "2025-01-01";
  const endDate = url.searchParams.get("end_date") || "2025-12-31";

  // coleta DB*_URL do process.env (DB1_URL, DB2_URL, ...)
  const dbEntries = Object.entries(process.env).filter(([k]) =>
    /^DB\d+_URL$/.test(k)
  );

  const months = generateMonths(startDate, endDate);
  const results: Record<string, Record<string, number>> = {};
  const monthlySums: Record<string, number> = {};
  const errors: Record<string, string> = {};

  // Preencha monthlySums com zeros
  for (const m of months) monthlySums[m] = 0;

  for (const [envKey, envVal] of dbEntries) {
    if (!envVal) {
      errors[envKey] = "Valor vazio no .env";
      continue;
    }

    let parsed;
    try {
      parsed = parseMysqlUrl(envVal as string);
    } catch (err) {
      errors[envKey] = `Erro parse URL: ${(err as Error).message}`;
      continue;
    }

    // FORÇAR host para mysql.cedroinfo.com.br (garante que usamos o host correto)
    const hostToUse = "mysql.cedroinfo.com.br";

    // decodeURIComponent permite senhas com %2A, %40, etc.
    const user = parsed.user;
    const password = decodeURIComponent(parsed.password);
    const database = parsed.database;
    const port = parsed.port || 3306;

    let conn;
    try {
      conn = await mysql.createConnection({
        host: hostToUse,
        port,
        user,
        password,
        database,
        // opcional: connectTimeout: 10000,
      });

      const [rows] = await conn.query<any[]>(
        `
        SELECT YEAR(dtcashflow) AS year, MONTH(dtcashflow) AS month, COALESCE(SUM(totalflow), 0) AS totalflow
        FROM cashflow
        WHERE fk_idcustomer IS NOT NULL
          AND dtcashflow BETWEEN ? AND ?
        GROUP BY YEAR(dtcashflow), MONTH(dtcashflow)
        ORDER BY YEAR(dtcashflow), MONTH(dtcashflow)
        `,
        [startDate, endDate]
      );

      // Inicia mensal com zeros
      const monthlyData: Record<string, number> = {};
      for (const m of months) monthlyData[m] = 0;

      for (const r of rows) {
        const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
        const val = Number(r.totalflow ?? 0);
        monthlyData[key] = val;
        monthlySums[key] = (monthlySums[key] || 0) + val;
      }

      results[database] = monthlyData;
    } catch (err) {
      // captura erro detalhado, mas não quebra o loop
      const msg = (err as Error & { code?: string }).message ?? String(err);
      const code = (err as any).code ? ` (${(err as any).code})` : "";
      errors[envKey] = `DB=${database} user=${user}: ${msg}${code}`;
      console.error(`Erro DB ${envKey}:`, err);
    } finally {
      if (conn) {
        try { await conn.end(); } catch (_) {}
      }
    }
  }

  return Response.json({
    months,
    totalsByBank: results,
    monthlySums,
    errors, // <--- inclui erros por DB para depuração
  });
}
