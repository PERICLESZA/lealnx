// src/app/api/dsmonth/route.ts
import mysql from "mysql2/promise";

/**
 * 🔹 Função: generateMonths
 * Gera um array com todas as combinações "YYYY-MM" entre duas datas.
 * 
 * @param start - Data inicial no formato "YYYY-MM-DD".
 * @param end - Data final no formato "YYYY-MM-DD".
 * @returns Array de strings com os meses no formato "YYYY-MM".
 *
 * Exemplo:
 * generateMonths("2025-01-01", "2025-03-31")
 * → ["2025-01", "2025-02", "2025-03"]
 */
function generateMonths(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const months: string[] = [];

  // Normaliza para o primeiro dia do mês
  s.setDate(1);
  e.setDate(1);

  while (s <= e) {
    const y = s.getFullYear();
    const m = String(s.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
    s.setMonth(s.getMonth() + 1);
  }

  return months;
}

/**
 * 🔹 Função: parseMysqlUrl
 * Faz o parsing (extração dos dados) de uma URL de conexão MySQL
 * no formato `mysql://user:password@host:port/database`.
 * 
 * @param url - URL do banco de dados (ex: process.env.DB1_URL)
 * @returns Objeto com user, password, host, port e database.
 *
 * Lança erro se a URL estiver fora do formato esperado.
 */
function parseMysqlUrl(url: string) {
  // Regex mais permissiva para aceitar caracteres especiais em user e password
  const re = /^mysql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/(.+)$/;
  const match = url.match(re);
  if (!match) throw new Error(`URL inválida: ${url}`);
  const [, user, password, host, port, database] = match;
  return { user, password, host, port: Number(port), database };
}

/**
 * 🔹 Função principal: GET
 * Endpoint de API (rota GET /api/dsmonth)
 *
 * 1. Lê parâmetros `start_date` e `end_date` da URL (ou assume 2025 por padrão);
 * 2. Lê todas as variáveis de ambiente `DB*_URL` (bancos a consultar);
 * 3. Gera a lista de meses entre as datas (com `generateMonths`);
 * 4. Para cada banco:
 *     - Faz conexão MySQL,
 *     - Executa query somando totalflow por mês/ano,
 *     - Monta um objeto com os resultados mensais;
 * 5. Retorna JSON com:
 *     - months → lista dos meses
 *     - totalsByBank → somatórios por banco
 *     - monthlySums → soma total combinada
 *     - errors → mensagens de erro, se houver.
 */
export async function GET(request: Request) {
  // Extrai os parâmetros de data da query string
  const url = new URL(request.url);
  const startDate = url.searchParams.get("start_date") || "2025-01-01";
  const endDate = url.searchParams.get("end_date") || "2025-12-31";

  // console.log("startDate recebido:", startDate);
  // console.log("endDate recebido:", endDate);

  // Filtra variáveis de ambiente que seguem o padrão DB1_URL, DB2_URL, etc.
  const dbEntries = Object.entries(process.env).filter(([k]) =>
    /^DB\d+_URL$/.test(k)
  );

  // Gera a lista de meses entre as datas
  const months = generateMonths(startDate, endDate);

  // Estruturas de resultado
  const results: Record<string, Record<string, number>> = {}; // valores por banco
  const monthlySums: Record<string, number> = {}; // total geral por mês
  const errors: Record<string, string> = {}; // erros de conexão/execução

  // Inicializa todos os meses com zero
  for (const m of months) monthlySums[m] = 0;

  // 🔁 Loop por cada banco de dados configurado no .env
  for (const [envKey, envVal] of dbEntries) {
    if (!envVal) {
      errors[envKey] = "Valor vazio no .env";
      continue;
    }

    // Faz parsing da URL do banco
    let parsed;
    try {
      parsed = parseMysqlUrl(envVal as string);
    } catch (err) {
      errors[envKey] = `Erro parse URL: ${(err as Error).message}`;
      continue;
    }

    // Força o host (override de segurança)
    const hostToUse = "mysql.cedroinfo.com.br";

    // Descodifica senhas com caracteres especiais (%40, %2A, etc.)
    const user = parsed.user;
    const password = decodeURIComponent(parsed.password);
    const database = parsed.database;
    const port = parsed.port || 3306;

    let conn;
    try {
      // 🔹 Conecta ao banco MySQL
      conn = await mysql.createConnection({
        host: hostToUse,
        port,
        user,
        password,
        database,
      });

      // 🔹 Executa consulta de somatório mensal
      const [rows] = await conn.query<any[]>(
        `
        SELECT 
          YEAR(dtcashflow) AS year, 
          MONTH(dtcashflow) AS month, 
          COALESCE(SUM(totalflow), 0) AS totalflow
        FROM cashflow
        WHERE fk_idcustomer IS NOT NULL
          AND dtcashflow BETWEEN ? AND ?
        GROUP BY YEAR(dtcashflow), MONTH(dtcashflow)
        ORDER BY YEAR(dtcashflow), MONTH(dtcashflow)
        `,
        [startDate, endDate]
      );

      // console.log("rows retornados do banco:", rows);

      // Inicializa todos os meses com zero
      // Gera apenas meses que realmente vieram do banco
      const monthlyData: Record<string, number> = {};

      for (const r of rows) {
        const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
        const val = Number(r.totalflow ?? 0);
        monthlyData[key] = val;
        monthlySums[key] = (monthlySums[key] || 0) + val;
      }

      // Garante que apenas meses válidos (com dados) sejam mantidos
      const monthsWithData = Object.keys(monthlyData);

      // Se quiser que o resultado final mostre apenas meses com dados:
      results[database] = monthlyData;

    } catch (err) {
      // ⚠️ Captura erro sem interromper os outros bancos
      const msg = (err as Error & { code?: string }).message ?? String(err);
      const code = (err as any).code ? ` (${(err as any).code})` : "";
      errors[envKey] = `DB=${database} user=${user}: ${msg}${code}`;
      console.error(`Erro DB ${envKey}:`, err);
    } finally {
      // Fecha a conexão
      if (conn) {
        try { await conn.end(); } catch (_) {}
      }
    }
  }

  // Retorna o JSON com tudo
  const responseData = {
    months: Object.keys(monthlySums).filter(m => monthlySums[m] > 0),
    totalsByBank: results,
    monthlySums,
    errors,
  };

  // console.log("🔹 Resultado final do endpoint /api/dsmonth:", JSON.stringify(responseData, null, 2));

  return Response.json(responseData);
}
