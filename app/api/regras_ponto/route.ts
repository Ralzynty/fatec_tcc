import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [regras] = await db.query(`
      SELECT
        id,
        tipo,
        nome,
        valor,
        unidade,
        editavel
      FROM regras_ponto
      ORDER BY id ASC
    `);

    return NextResponse.json(regras);
  } catch (erro) {
    console.error("Erro ao buscar regras:", erro);

    return NextResponse.json(
      { erro: "Erro ao buscar regras de ponto." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const dados = await request.json();

    const { id, valor } = dados;

    if (!id || valor === undefined || valor === "") {
      return NextResponse.json(
        { erro: "Informe o ID e o valor da regra." },
        { status: 400 }
      );
    }

    const [resultado] = await db.query(
      `
        UPDATE regras_ponto
        SET valor = ?
        WHERE id = ? AND editavel = TRUE
      `,
      [valor, id]
    );

    const resultadoAlteracao = resultado as { affectedRows: number };

    if (resultadoAlteracao.affectedRows === 0) {
      return NextResponse.json(
        { erro: "Regra não encontrada ou não editável." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      mensagem: "Regra atualizada com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao atualizar regra:", erro);

    return NextResponse.json(
      { erro: "Erro ao atualizar regra." },
      { status: 500 }
    );
  }
}