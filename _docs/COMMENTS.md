# Decisão de Arquitetura

A escolha da arquitetura foi baseada em princípios de design de software, como a separação de responsabilidades, a modularidade e a escalabilidade. A arquitetura escolhida foi a arquitetura de microsserviços, que é uma abordagem que divide um sistema em pequenos serviços independentes, cada um com sua própria lógica de negócio.

## Arquitetura do Backend (Core)

O backend segue um grupo de ferramentas como Express.js com TypeScript, utilizando Prisma como ORM e implementando o padrão *Controller-Service*. Esta arquitetura segue uma separação de responsabilidades clara, onde os Controllers gerenciam as requisições HTTP, os Services encapsulam a lógica de negócio, e o Prisma atua como camada de persistência. Os componentes principais são:

1. Estrutura do Projeto

```txt
core/
├── prisma/
│   ├── schema.prisma    # Esquema do banco de dados
│   ├── migrations/      # Migrações do banco de dados
│   └── seed.ts         # Script de população inicial
├── src/
│   ├── controllers/    # Lógica de negócio
│   ├── middlewares/    # Middleware de processamento de requisições
│   ├── services/       # Serviços compartilhados
│   ├── utils/         # Funções utilitárias
│   ├── lib/           # Bibliotecas principais
│   └── index.ts       # Ponto de entrada da aplicação
```

2. Componentes Principais
- **Autenticação**
  - Autenticação baseada em JWT
  - Controle de acesso baseado em papéis (admin/estudante)

- **Controllers**  
  - Gerenciamento de estudantes
  - Gerenciamento de cursos
  - Gerenciamento de turmas
  - Gerenciamento de matrículas

- **Validação de Dados**
  - Utiliza Zod para validação de esquema
  - Manipulação de requisições com tipagem segura

3. Interações com o Banco de Dados
- Utiliza Prisma Client para operações com tipagem segura
- Implementa transações para integridade dos dados
- Gerencia relacionamentos e operações em cascata

4. Recursos de Segurança
- Hash de senha
- Validação de token JWT
- Controle de acesso baseado em papéis
- Validação de inputs

# Arquitetura do Banco de Dados

![Arquitetura do Banco de Dados](/_docs/imgs/database_architecture.png)

### User (Usuário)
- Entidade principal para autenticação e gerenciamento de usuários
- Contém informações básicas do usuário (email, senha)
- Suporta dois papéis (role): admin e student (estudante)
- Possui relacionamentos auto-referenciais para rastrear quem criou/atualizou os registros
- Conectado ao Profile através de um relacionamento One-to-One.

### Profile (Perfil)
- Estende as informações do Usuário
- Contém detalhes pessoais:
  - nome
  - matrícula acadêmica (ID do estudante)
  - identificação (CPF)
- Relacionamento One-to-One com User
- Relacionamento One-to-Many com Registrations

### Course (Curso)
- Representa cursos acadêmicos
- Contém:
  - nome
  - descrição
- Relacionamento One-to-Many com Groups

### Group (Turma)
- Representa instâncias/turmas de cursos
- Contém:
  - código único
  - datas de início e término
  - informações de rastreamento (criado/atualizado por)
- Relacionamento muitos-para-um com Course
- Relacionamento um-para-muitos com Registrations

### Registration (Matrícula)
- Representa a matrícula do estudante nas turmas
- Contém:
  - data de matrícula
  - status (ativo/cancelado/finalizado)
- Relacionamentos muitos-para-um com Profile (estudante) e Group


# Lista de bibliotecas utilizadas

## Backend

- **Express.js**: Framework web para Node.js.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Prisma**: ORM para manipulação de banco de dados.
- **Zod**: Biblioteca para validação de esquemas.
- **bcrypt**: Biblioteca para hash de senhas.
- **jsonwebtoken**: Biblioteca para geração e verificação de tokens JWT.

## Frontend

- **Vue.js**: Framework JavaScript para construção de interfaces.
- **Vuetify**: Framework de componentes para Vue.js.
- **Axios**: Cliente HTTP para requisições.
- **Vue Router**: Roteamento para Vue.js.


## O que melhoraria se tivesse mais tempo

- Documentação detalhada da API.
- Implementação de rate limiting.
- Validação de força de senha.
- Login com Google ou outros provedores.

**Perfomance**

- Implementação de cache.
- Otimização de queries.
- Paginação.

**UX/UI**

- Melhorar feedback visual de erros
- Adicionar mais animações e transições