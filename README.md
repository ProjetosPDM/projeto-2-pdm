# Horário de Bolso IFPB

O projeto consiste no desenvolvimento de um aplicativo móvel voltado para os estudantes do IFPB, com o objetivo de facilitar a consulta rápida ao horário e local das aulas, eliminando a necessidade de acessar PDFs ou o sistema SUAP no cotidiano.

O aplicativo funciona como um "horário de bolso" personalizado, atendendo inclusive alunos com grades de horários variadas. O sistema possui dois perfis: o administrador, responsável por gerenciar as disciplinas, salas, horários e aprovar o acesso de novos usuários; e o aluno, que seleciona suas disciplinas para gerar uma grade automática.

## Visão Geral

- O administrador cadastra e remove disciplinas, definindo nome da matéria, professor, dias da semana, horários e local das aulas (salas ou laboratórios).
- O administrador também controla o acesso ao sistema, aprovando ou rejeitando contas de alunos após o cadastro.
- O aluno busca e seleciona suas disciplinas no primeiro acesso.
- A partir dessa seleção, o aplicativo monta automaticamente a grade personalizada do estudante.
- Na tela inicial, o app exibe os cards das aulas do dia com informações de professor, horário e bloco.
- O sistema destaca automaticamente a "Aula Atual" com base no relógio do dispositivo.
- O app funciona offline após a configuração inicial, armazenando os dados localmente para acesso rápido sem conexão constante.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npx expo start
```

3. Abra no emulador ou em um dispositivo usando Expo Go.

## Releases e Downloads

O aplicativo compilado em APK está disponível na seção [Releases](https://github.com/ProjetosPDM/projeto-2-pdm/releases) do repositório. Você pode fazer download do APK e instalá-lo diretamente em um dispositivo Android.

## Configuração do .env

Para que o aplicativo funcione corretamente, configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

Substitua pelos valores da sua conta Supabase:
- `EXPO_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `EXPO_PUBLIC_SUPABASE_KEY`: Chave anônima pública do Supabase

## Estrutura do projeto

```
projeto-2-pdm/
├── app/
│   ├── _layout.tsx                 # Layout raiz da aplicação
│   ├── search-subjects.tsx         # Tela de busca de disciplinas
│   ├── (admin)/                    # Grupo de rotas administrativas
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Dashboard do administrador
│   │   ├── alunos.tsx              # Gerenciamento de alunos
│   │   └── perfil.tsx              # Perfil do administrador
│   ├── (auth)/                     # Grupo de rotas de autenticação
│   │   ├── _layout.tsx
│   │   ├── login.tsx               # Tela de login
│   │   ├── register.tsx            # Tela de cadastro
│   │   └── pending.tsx             # Status de aprovação pendente
│   └── (tabs)/                     # Grupo de rotas com abas
│       ├── _layout.tsx
│       ├── index.tsx               # Tela inicial (horário do dia)
│       ├── grade.tsx               # Grade completa de disciplinas
│       └── perfil.tsx              # Perfil do aluno
├── components/
│   ├── ConflictModal.tsx           # Modal para conflitos de horário
│   ├── EmptyState.tsx              # Componente para estados vazios
│   └── ScheduleCard.tsx            # Card de aula
├── context/
│   ├── AuthContext.tsx             # Contexto de autenticação
│   ├── SubjectContext.tsx          # Contexto de disciplinas
│   └── ThemeContext.tsx            # Contexto de tema (dark/light)
├── services/
│   ├── authService.ts              # Autenticação e gerenciamento de usuários
│   ├── adminService.ts             # Operações de administração
│   └── subjectService.ts           # CRUD de disciplinas
├── utils/
│   ├── database.ts                 # Configurações do banco local
│   ├── date.ts                     # Utilitários de data e hora
│   └── supabase.ts                 # Cliente Supabase
├── types/
│   ├── User.ts                     # Tipo de usuário
│   ├── Subject.ts                  # Tipo de disciplina
│   └── SubjectSearch.ts            # Tipo de busca de disciplinas
├── data/
│   └── mockDisciplinas.ts          # Dados de exemplo
├── assets/
│   └── images/                     # Imagens da aplicação
├── constants/
│   └── Colors.ts                   # Paleta de cores
└── package.json                    # Dependências do projeto
```

### Descrição das pastas principais:

- **app/** - Estrutura de rotas usando Expo Router com autenticação, admin e abas.
- **components/** - Componentes reutilizáveis da interface (cards, modais, estados vazios).
- **context/** - Gerenciamento global de estado com Context API.
- **services/** - Lógica de negócio e integrações com API/Supabase.
- **utils/** - Funções auxiliares para datas, banco de dados e Supabase.
- **types/** - Definições TypeScript para garantir segurança de tipos.
- **constants/** - Valores constantes como cores e configurações.

## Tecnologias

- Expo
- React Native
- TypeScript
- Supabase para backend
- Armazenamento local com SQLite para suporte offline

## Autores

**Alison Andrade**

- GitHub: [https://github.com/AlisonAndrade123](https://github.com/AlisonAndrade123)
- LinkedIn: [https://www.linkedin.com/in/alison-andrade-b23621308/](https://www.linkedin.com/in/alison-andrade-b23621308/)

**Dário Matias**

- GitHub: [https://github.com/dariomatias-dev](https://github.com/dariomatias-dev)
- LinkedIn: [https://linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)

**José Arthur Almeida**

- GitHub: [https://github.com/JoseArthurAlmeida](https://github.com/JoseArthurAlmeida)
- LinkedIn: [https://www.linkedin.com/in/jose-arthur-araujo-almeida/](https://www.linkedin.com/in/jose-arthur-araujo-almeida/)