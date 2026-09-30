import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const servidorId = searchParams.get("servidor_id");
    const data = searchParams.get("data");

    let sql = `
      SELECT
        rp.id,
        rp.servidor_id,
        s.nome_completo,
        DATE_FORMAT(rp.data, '%Y-%m-%d') AS data,
        TIME_FORMAT(rp.entrada, '%H:%i') AS entrada,
        TIME_FORMAT(rp.saida, '%H:%i') AS saida,
        rp.status
      FROM registros_ponto rp
      INNER JOIN servidores s ON s.id = rp.servidor_id
      WHERE 1=1
    `;

    const params: (string | number)[] = [];

    if (servidorId) {
      sql += " AND rp.servidor_id = ?";
      params.push(Number(servidorId));
    }

    if (data) {
      sql += " AND rp.data = ?";
      params.push(data);
    }

    sql += " ORDER BY rp.data DESC, rp.id DESC";

    const [rows] = await db.query(sql, params);

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { erro: "Erro ao buscar registros de ponto." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { servidor_id, acao } = body;

    if (!servidor_id || !acao) {
      return NextResponse.json(
        { erro: "Servidor e ação são obrigatórios." },
        { status: 400 }
      );
    }

    const [registros] = await db.query(
      `
      SELECT *
      FROM registros_ponto
      WHERE servidor_id = ?
        AND data = CURDATE()
      LIMIT 1
      `,
      [servidor_id]
    );

    const registro = (registros as any[])[0];

    if (acao === "entrada") {
      if (registro) {
        return NextResponse.json(
          { erro: "A entrada de hoje já foi registrada." },
          { status: 400 }
        );
      }

      const [resultado] = await db.query(
        `
        INSERT INTO registros_ponto
          (servidor_id, data, entrada, status)
        VALUES
          (?, CURDATE(), CURTIME(), 'Em andamento')
        `,
        [servidor_id]
      );

      return NextResponse.json({
        mensagem: "Entrada registrada com sucesso.",
        id: (resultado as any).insertId,
      });
    }

    if (acao === "saida") {
      if (!registro) {
        return NextResponse.json(
          { erro: "Nenhuma entrada foi registrada hoje." },
          { status: 400 }
        );
      }

      if (registro.saida) {
        return NextResponse.json(
          { erro: "A saída de hoje já foi registrada." },
          { status: 400 }
        );
      }

      await db.query(
        `
        UPDATE registros_ponto
        SET
          saida = CURTIME(),
          status = 'Concluído'
        WHERE id = ?
        `,
        [registro.id]
      );

      return NextResponse.json({
        mensagem: "Saída registrada com sucesso.",
      });
    }

    return NextResponse.json(
      { erro: "Ação inválida." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { erro: "Erro ao registrar ponto." },
      { status: 500 }
    );
  }
}