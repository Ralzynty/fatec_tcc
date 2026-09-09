"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Passo = 1 | 2 | 3;

export default function EsqueciSenha() {
  const router = useRouter();
  const [passo, setPasso] = useState<Passo>(1);
  const [concluido, setConcluido] = useState(false);
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const [codigo, setCodigo] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsCodigo = useRef<(HTMLInputElement | null)[]>([]);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  function enviarCodigo() {
    if (email.trim() === "") {
      setErroEmail("Informe seu e-mail institucional.");
      return;
    }

    setErroEmail("");
    setEnviandoCodigo(true);

    setTimeout(() => {
      setEnviandoCodigo(false);
      setPasso(2);
    }, 1200);
  }

  function handleDigitoChange(index: number, valor: string) {
    if (!/^[0-9]?$/.test(valor)) return;

    const novoCodigo = [...codigo];
    novoCodigo[index] = valor;
    setCodigo(novoCodigo);

    if (valor !== "" && index < 5) {
      inputsCodigo.current[index + 1]?.focus();
    }
  }

  function handleDigitoKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && codigo[index] === "" && index > 0) {
      inputsCodigo.current[index - 1]?.focus();
    }
  }

  const codigoCompleto = codigo.every((d) => d !== "");

  function confirmarCodigo() {
    if (!codigoCompleto) return;
    setPasso(3);
  }

  function redefinirSenha() {
    if (novaSenha.length < 8) {
      setErroSenha("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha("As senhas não coincidem.");
      return;
    }

    setErroSenha("");
    setSalvando(true);

    setTimeout(() => {
      setSalvando(false);
      setConcluido(true);
    }, 1200);
  }

  return (
    <main className="pagina">
      <header className="cabecalho">
        <div className="logo">BP</div>
        <div>
          <h1>BatePonto</h1>
          <p>Redefinição de Senha</p>
        </div>

        {!concluido && (
          <button className="voltarLogin" onClick={() => router.push("/")}>
            ← Voltar ao login
          </button>
        )}
      </header>

      <section className="recuperar">
        {concluido ? (
          <div className="sucesso">
            <div className="iconeSucesso">✓</div>
            <p className="concluidoLabel">CONCLUÍDO</p>
            <h2>Senha redefinida</h2>
            <p className="descricao">
              Sua senha foi atualizada com sucesso.
              <br />
              Agora você pode acessar o sistema normalmente.
            </p>
            <button className="acessar" onClick={() => router.push("/")}>
              VOLTAR AO LOGIN
            </button>
          </div>
        ) : (
          <>
            <div className="stepper">
              {[1, 2, 3].map((n, i) => (
                <div className="stepperItem" key={n}>
                  <div className="stepperGrupo">
                    <div
                      className={
                        "stepCirculo " +
                        (passo === n ? "atual" : passo > n ? "concluido" : "")
                      }
                    >
                      {passo > n ? "✓" : n}
                    </div>
                    <span className="stepLabel">
                      {n === 1 ? "E-MAIL" : n === 2 ? "VERIFICAÇÃO" : "NOVA SENHA"}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className={"stepLinha " + (passo > n ? "concluido" : "")} />
                  )}
                </div>
              ))}
            </div>

            {passo === 1 && (
              <>
                <p className="identificacao">PASSO 1 DE 3</p>
                <h2>Informe o e-mail</h2>
                <p className="descricao">
                  Digite seu e-mail institucional para receber o código de verificação.
                </p>

                <label>E-MAIL INSTITUCIONAL</label>
                <input
                  type="email"
                  placeholder="nome@instituicao.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {erroEmail && <div className="erroTexto">⚠ {erroEmail}</div>}

                <button
                  className="acessar"
                  disabled={enviandoCodigo}
                  onClick={enviarCodigo}
                >
                  {enviandoCodigo ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
                </button>
              </>
            )}

            {passo === 2 && (
              <>
                <p className="identificacao">PASSO 2 DE 3</p>
                <h2>Código de verificação</h2>
                <p className="descricao">
                  Enviamos um código de 6 dígitos para <strong>{email}</strong>.
                </p>

                <label>CÓDIGO DE 6 DÍGITOS</label>
                <div className="codigoBox">
                  {codigo.map((digito, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputsCodigo.current[i] = el;
                      }}
                      className="codigoInput"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digito}
                      onChange={(e) => handleDigitoChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitoKeyDown(i, e)}
                    />
                  ))}
                </div>

                <button
                  className="acessar"
                  disabled={!codigoCompleto}
                  onClick={confirmarCodigo}
                >
                  CONFIRMAR CÓDIGO
                </button>

                <p className="reenviar" onClick={enviarCodigo}>
                  REENVIAR CÓDIGO
                </p>
              </>
            )}

            {passo === 3 && (
              <>
                <p className="identificacao">PASSO 3 DE 3</p>
                <h2>Nova senha</h2>
                <p className="descricao">Crie uma senha forte com ao menos 8 caracteres.</p>

                <label>NOVA SENHA</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />

                <label>CONFIRMAR SENHA</label>
                <input
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className={erroSenha ? "inputErro" : ""}
                />

                {erroSenha && <div className="erroTexto">⚠ {erroSenha}</div>}

                <button className="acessar" disabled={salvando} onClick={redefinirSenha}>
                  {salvando ? "SALVANDO..." : "REDEFINIR SENHA"}
                </button>
              </>
            )}
          </>
        )}
      </section>

      <footer>
        <span>© 2026 • BatePonto{!concluido ? "" : " · Uso institucional"}</span>
        <span>Acesso restrito a servidores autorizados</span>
      </footer>
    </main>
  );
}
