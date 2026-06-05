# 📘 CECI — Computação Educacional Cognitiva para Inclusão Digital

## 🧠 Sobre o Projeto

O **CECI** é uma plataforma web voltada à **alfabetização digital de adultos e idosos**, com foco em inclusão, acessibilidade e autonomia no uso de tecnologias.

Diferente de cursos tradicionais, o projeto propõe uma experiência **adaptativa e acolhedora**, respeitando o ritmo de cada usuário e reduzindo inseguranças comuns no processo de aprendizagem digital.

A personagem guia **Ceci** atua como mediadora da experiência, tornando o aprendizado mais leve, amigável e acessível.

---

## 🎯 Objetivos

- Promover inclusão digital de forma acessível;
- Reduzir o medo de errar no ambiente digital;
- Aumentar a confiança e autonomia do usuário;
- Diminuir taxas de desistência em processos de aprendizagem;
- Oferecer acompanhamento personalizado.

---

## 💡 Diferenciais Técnicos

- **Classificação silenciosa de nível**
  O sistema identifica o nível do usuário por meio de interações (tempo de resposta, cliques, tentativas), sem necessidade de testes formais.

- **IA como suporte pedagógico** *(via Gemini API — integração futura)*
  Reformulação de explicações, exemplos adicionais e adaptação de analogias conforme o perfil do usuário.

---

## 🧩 Estrutura Pedagógica

Cada lição é dividida em etapas sequenciais:

|    Tipo    |               Descrição               |
|------------|---------------------------------------|
| **Teoria** |      Explicações simples e diretas    | 
| **Jogo**   |      Exercícios interativos guiados   |
| **Quiz**   | Verificação do conhecimento adquirido |

Após o quiz, o sistema pode encaminhar para **Revisão** (flashcards) em caso de reprovação, ou seguir para a próxima lição em caso de aprovação.

### Recursos adicionais:
- Sistema de revisão com flashcards e curva de esquecimento;
- Personagem guia (Ceci);
- Vídeos educativos curados;
- Celebrações ao completar lições;
- Feedback e depoimentos de usuários.

---

## 📚 Conteúdos

### Módulos prioritários:
1. Uso do mouse
2. Uso do teclado
3. Dúvidas comuns sobre hardware

### Expansões futuras:
- Criação e uso de e-mail
- Navegação na internet
- Ferramentas corporativas
- Segurança digital

---

## 👥 Público-Alvo

Adultos e idosos com pouca ou nenhuma familiaridade com tecnologia.

**Principais desafios identificados:**
- Medo de errar;
- Insegurança no ambiente digital;
- Dificuldade de retenção;
- Necessidade de instruções passo a passo.

---

## ⚙️ Arquitetura Atual

```
ceci/
├── index.html               # Entrada da aplicação
├── package.json             # Dependências do frontend
├── src/                     # Código React (em desenvolvimento)
└── server/                  # Backend Node.js
    ├── index.js             # Servidor Express com rotas da API
    ├── lib/
    │   ├── supabaseClient.js    # Conexão com o banco Supabase
    │   └── geminiClient.js      # Cliente da API Gemini (Google GenAI)
    └── .env                 # Variáveis de ambiente (NÃO versionar)
```

### Frontend
- **React 19** com React Router DOM (SPA, roteamento client-side)
- **Vite** como bundler
- **Axios** para chamadas HTTP ao backend
- Estrutura de páginas em desenvolvimento; pronta para consumir a API quando o banco estiver configurado

### Backend
- **Node.js + Express** rodando na porta `3001`
- **CORS** habilitado para aceitar chamadas do frontend React
- Rotas planejadas:

|     Prefixo      |            Responsabilidade            |
|------------------|----------------------------------------|
| `GET /health`    | Health check do servidor               |
| `/api/usuario`   | Cadastro, login, perfil de aprendizado |
| `/api/licoes`    | Listagem e desbloqueio de lições       |
| `/api/progresso` | Registro de progresso e histórico      |
| `/api/conteudo`  | Etapas, desafios e revisões            |

### Banco de Dados
- **Supabase** (PostgreSQL gerenciado)
- Conexão configurada via `server/lib/supabaseClient.js`
- Schema em desenvolvimento; RLS e policies definidas conforme as entidades do UML

### Inteligência Artificial
- **Gemini API** (`@google/genai`) configurada via `server/lib/geminiClient.js`
- Integração com rotas ainda não implementada; cliente pronto para uso

---

## ⚙️ Fluxo do Sistema

```
Usuário interage com uma atividade
        ↓
Sistema registra o evento (tempo, cliques, erros)
        ↓
Evento salvo no Supabase
        ↓
AlgoritmoAdaptativo classifica o perfil do usuário
        ↓
Próxima lição sugerida com dificuldade ajustada
```

---

## 🗂️ Modelo de Domínio (UML)

O diagrama de classes completo está em `ceci_uml.pdf`. As entidades principais são:

- **Usuário / PerfilAprendizado** — dados do usuário e métricas de aprendizado (pontuação, tempo de resposta, erros)
- **Personagem** — a Ceci, guia da experiência
- **Lição / Etapa / Desafio** — estrutura do conteúdo pedagógico
- **AlgoritmoAdaptativo** — motor de classificação e sugestão de lições
- **Revisão** — sistema de flashcards pós-reprovação
- **Progresso** — histórico de lições concluídas e controle de revisões pendentes
- **Feedback / VideoRecomendado / Celebração** — recursos de suporte e motivação

> O **Chatbot** foi removido do escopo atual do projeto.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Conta no Supabase com o schema aplicado (ver `schema.sql`)

### Configuração
1. Copie `.env.example` para `.env` na raiz e preencha:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Copie `.env.example` para `server/.env` e preencha:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`

> ⚠️ **Nunca commite o arquivo `.env`.** Ele já está no `.gitignore` do servidor.

### Rodando o projeto
Com concurrently instalado (`npm install -D concurrently`):
```bash
npm run dev
```

Para conferir status do server: `http://localhost:3001/health`.

Ou em dois terminais separados:
```bash
# Terminal 1 — raiz
npm run dev

# Terminal 2 — server
cd server && node index.js
```

O front roda em `http://localhost:5173` e o server em `http://localhost:3001`.

---

## 📌 Status do Projeto

|           Camada          |                       Status                        |
|---------------------------|-----------------------------------------------------|
| Frontend (React)          | 🟡 Estrutura inicial — páginas em desenvolvimento  |
| Backend (Express)         | 🟡 Servidor iniciado — rotas a implementar         |
| Banco de dados (Supabase) | 🔴 Schema em definição                             |
| IA (Gemini)               | 🟡 Cliente configurado — integração pendente       |

---

## 📄 Desenvolvedores

- **Ana Clara** — [@anaClara]()
- **Ana Julia** — [@NjjSouza](https://github.com/NjjSouza)
- **Emily Horrana** — [@emyHorrana](https://github.com/emyHorrana)
- **Julia Santana** — [@JuliaSantana]()