import { NextRequest, NextResponse } from "next/server";
import dbs from "@/lib/multiPrisma";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start_date = searchParams.get("start_date") || "2025-01-01";
  const end_date = searchParams.get("end_date") || "2025-12-31";

  const totals: Record<string, any> = {};
  const grandTotals = {
    valueflow: 0,
    centsflow: 0,
    valuepercentflow: 0,
    cents2flow: 0,
    totalflow: 0,
    totaltopay: 0,
  };

  try {
    for (const [key, prisma] of Object.entries(dbs)) {
      if (!prisma) continue;

      const result = await prisma.cashflow.aggregate({
        _sum: {
          valueflow: true,
          centsflow: true,
          valuepercentflow: true,
          cents2flow: true,
          totalflow: true,
          totaltopay: true,
        },
        where: {
          fk_idcustomer: { not: null },
          dtcashflow: {
            gte: new Date(start_date),
            lte: new Date(end_date),
          },
        },
      });

      const formatted = {
        valueflow: formatCurrency(result._sum.valueflow ?? 0),
        centsflow: formatCurrency(result._sum.centsflow ?? 0),
        valuepercentflow: formatCurrency(result._sum.valuepercentflow ?? 0),
        cents2flow: formatCurrency(result._sum.cents2flow ?? 0),
        totalflow: formatCurrency(result._sum.totalflow ?? 0),
        totaltopay: formatCurrency(result._sum.totaltopay ?? 0),
      };

      totals[key] = formatted;

      // soma para grand total
      for (const field of Object.keys(grandTotals)) {
        grandTotals[field as keyof typeof grandTotals] +=
          result._sum[field as keyof typeof grandTotals] ?? 0;
      }
    }

    // formatar os totais gerais
    const formattedGrand = Object.fromEntries(
      Object.entries(grandTotals).map(([k, v]) => [k, formatCurrency(v)])
    );

    return NextResponse.json({
      totals,
      grand_totals: formattedGrand,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório", details: (error as Error).message },
      { status: 500 }
    );
  }
}
