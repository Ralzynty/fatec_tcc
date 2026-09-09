"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [cargoSelecionado, setCargoSelecionado] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const acessarSistema = () => {
    if (email === "" || senha === "" || cargoSelecionado === null) {
      setMostrarErro(true);
    } else {
      setMostrarErro(false);
      router.push("/sistema");
    }
  };
  const [mostrarErro, setMostrarErro] = useState(false);

  return (
    <main className="pagina">

      <header className="cabecalho">
        <div className="logo">
          BP
        </div>

        <div>
          <h1>BatePonto</h1>
          <p>Sistema de Frequência Eletrônica</p>
        </div>
      </header>


      <section className="login">

        <p className="identificacao">
          IDENTIFICAÇÃO
        </p>

        <h2>Entrar</h2>

        <p className="descricao">
          Selecione seu cargo e insira suas credenciais.
        </p>


        <div className="cargos">

          <button
            className={cargoSelecionado === "Professor" ? "cargo selecionado" : "cargo"}
            onClick={() => setCargoSelecionado("Professor")}
          >
            🎓
            <strong>Professor</strong>
            <span>Docente</span>
          </button>

          <button
            className={cargoSelecionado === "Gestor" ? "cargo selecionado" : "cargo"}
            onClick={() => setCargoSelecionado("Gestor")}
          >
            🏛️
            <strong>Gestor</strong>
            <span>Coordenador / Diretor de Unidade</span>
          </button>

          <button
            className={cargoSelecionado === "Recursos Humanos" ? "cargo selecionado" : "cargo"}
            onClick={() => setCargoSelecionado("Recursos Humanos")}
          >
            👥
            <strong>Recursos Humanos</strong>
            <span>Setor de Gestão de Pessoas</span>
          </button>

        </div>


        <label>
          E-MAIL
        </label>

        <input
          type="text"
          placeholder="nome@instituicao.sp.gov.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <label>
          SENHA
        </label>

        <input
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {mostrarErro && (
          <div className="erro">
            ⚠ Preencha matrícula e senha.
          </div>
        )}

        <button
          className="acessar"
          onClick={acessarSistema}
        >
          ACESSAR SISTEMA
        </button>


        <p className="esqueci">
          Esqueceu a senha?
          <a href="#"> Clique aqui</a>
        </p>

      </section>


      <footer>
        © 2026 • BatePonto • Uso institucional
      </footer>

    </main>
  );
}