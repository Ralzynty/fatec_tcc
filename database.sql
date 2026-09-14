USE bateponto;

-- A tabela servidores já foi criada durante nosso passo a passo.
-- O status é usado pela tela do RH.
ALTER TABLE servidores
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'Ativo';

-- Crie o RH inicial para o primeiro acesso.
-- Troque a senha antes de usar o sistema em produção.
INSERT INTO usuarios (email, senha, cargo)
VALUES ('rh@instituicao.sp.gov.br', '987654', 'RH');
