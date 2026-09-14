import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Usuario extends RowDataPacket {
  id: number;
  email: string;
  senha: string;
  cargo: string;
  servidor_id: number | null;
}

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const [rows] = await db.execute<Usuario[]>(
      `SELECT id, email, senha, cargo, servidor_id
       FROM usuarios
       WHERE email = ? AND senha = ? AND cargo = ?
       LIMIT 1`,
      [dados.email, dados.senha, dados.cargo]
    );

    if (rows.length === 0) {
      return Response.json({ mensagem: "Login inválido" }, { status: 401 });
    }

    return Response.json({
      mensagem: "Login autorizado",
      cargo: rows[0].cargo,
      usuarioId: rows[0].id,
      servidorId: rows[0].servidor_id,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ mensagem: "Erro ao conectar ao banco." }, { status: 500 });
  }
}
