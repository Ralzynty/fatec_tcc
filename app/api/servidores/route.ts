import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get("busca") || "";

    let sql = `
      SELECT
        id,
        nome_completo,
        cpf,
        matricula,
        cargo,
        materia,
        regime,
        DATE_FORMAT(data_admissao, '%Y-%m-%d') AS data_admissao,
        email_institucional,
        status
      FROM servidores
    `;

    const valores: string[] = [];

    if (busca) {
      sql += `
        WHERE nome_completo LIKE ?
        OR matricula LIKE ?
        OR email_institucional LIKE ?
      `;

      const termo = `%${busca}%`;
      valores.push(termo, termo, termo);
    }

    sql += ` ORDER BY nome_completo ASC`;

    const [servidores] = await db.query(sql, valores);

    return NextResponse.json(servidores);
  } catch (erro) {
    console.error("Erro ao buscar servidores:", erro);

    return NextResponse.json(
      { erro: "Erro ao buscar servidores." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const {
      nome_completo,
      cpf,
      matricula,
      cargo,
      materia,
      regime,
      data_admissao,
      email_institucional,
    } = dados;

    if (
      !nome_completo ||
      !cpf ||
      !matricula ||
      !cargo ||
      !regime ||
      !data_admissao ||
      !email_institucional
    ) {
      return NextResponse.json(
        { erro: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const [resultado] = await db.query(
      `
        INSERT INTO servidores
        (
          nome_completo,
          cpf,
          matricula,
          cargo,
          materia,
          regime,
          data_admissao,
          email_institucional,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Ativo')
      `,
      [
        nome_completo,
        cpf,
        matricula,
        cargo,
        materia || null,
        regime,
        data_admissao,
        email_institucional,
      ]
    );

    return NextResponse.json(
      {
        mensagem: "Servidor cadastrado com sucesso.",
        resultado,
      },
      { status: 201 }
    );
  } catch (erro: any) {
    console.error("Erro ao cadastrar servidor:", erro);

    if (erro.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          erro: "CPF, matrícula ou e-mail institucional já cadastrado.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { erro: "Erro ao cadastrar servidor." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const dados = await request.json();

    const {
      id,
      nome_completo,
      matricula,
      cargo,
      materia,
      regime,
      data_admissao,
    } = dados;

    if (!id) {
      return NextResponse.json(
        { erro: "ID do servidor não informado." },
        { status: 400 }
      );
    }

    await db.query(
      `
        UPDATE servidores
        SET
          nome_completo = ?,
          matricula = ?,
          cargo = ?,
          materia = ?,
          regime = ?,
          data_admissao = ?
        WHERE id = ?
      `,
      [
        nome_completo,
        matricula,
        cargo,
        materia || null,
        regime,
        data_admissao,
        id,
      ]
    );

    return NextResponse.json({
      mensagem: "Servidor atualizado com sucesso.",
    });
  } catch (erro: any) {
    console.error("Erro ao editar servidor:", erro);

    if (erro.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          erro: "A matrícula informada já está cadastrada.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { erro: "Erro ao atualizar servidor." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { erro: "ID do servidor não informado." },
        { status: 400 }
      );
    }

    await db.query(
      `DELETE FROM servidores WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      mensagem: "Servidor excluído com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao excluir servidor:", erro);

    return NextResponse.json(
      { erro: "Erro ao excluir servidor." },
      { status: 500 }
    );
  }
}