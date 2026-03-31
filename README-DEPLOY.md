# CINETRON — Deploy no Vercel

## Estrutura do Projeto

```
cinetron/
├── frontend/          # React + Vite (serve o app)
├── api/               # Serverless Functions (Express via Vercel)
│   ├── index.js       # Entry point do backend
│   ├── routes/        # Rotas auth, watchlist, downloads
│   ├── models/        # User, Media (Mongoose)
│   └── middleware/    # auth.js (JWT)
├── vercel.json        # Configuração do Vercel
└── .gitignore
```

---

## Pré-requisitos

1. **Conta no Vercel** → [vercel.com](https://vercel.com) (gratuito)
2. **Banco MongoDB Atlas** → [mongodb.com/atlas](https://www.mongodb.com/atlas) (gratuito)
3. **Chave TMDB** → [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (gratuita)

---

## Passo a Passo

### 1. MongoDB Atlas — criar banco gratuito

1. Crie conta em mongodb.com/atlas
2. Crie um **Cluster M0** (gratuito)
3. Em **Database Access**: crie usuário com senha
4. Em **Network Access**: adicione `0.0.0.0/0` (permite Vercel)
5. Copie a **Connection String** (formato: `mongodb+srv://user:pass@cluster.../cinetron`)

---

### 2. Vercel — fazer deploy

**Opção A — Via GitHub (recomendado):**
1. Suba o projeto no GitHub
2. Acesse [vercel.com/new](https://vercel.com/new)
3. Importe o repositório
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (raiz)
   - O `vercel.json` já configura tudo automaticamente

**Opção B — Via Vercel CLI:**
```bash
npm install -g vercel
cd cinetron
vercel --prod
```

---

### 3. Variáveis de Ambiente no Vercel

No painel do Vercel → Settings → Environment Variables, adicione:

| Variável | Valor | Onde usar |
|----------|-------|-----------|
| `VITE_TMDB_API_KEY` | sua chave TMDB | Frontend |
| `MONGO_URI` | mongodb+srv://... | Backend (api) |
| `JWT_SECRET` | string segreta longa | Backend (api) |
| `JWT_EXPIRES` | `30d` | Backend (api) |
| `FRONTEND_URL` | `https://seu-projeto.vercel.app` | Backend (api) |

> ⚠️ `VITE_*` só funciona se marcado como "Environment Variables" no build do frontend.
> As variáveis sem `VITE_` só ficam disponíveis no servidor (serverless functions).

---

### 4. Desenvolvimento Local

```bash
# Terminal 1 — Frontend
cd frontend
npm install
npm run dev

# Terminal 2 — Backend
cd api
npm install
node --watch index.js
```

Configure `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=sua_chave_aqui
```

Configure `api/.env` (crie na pasta api/):
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=qualquer_string_segura
JWT_EXPIRES=30d
FRONTEND_URL=http://localhost:5173
```

---

## Como funciona o roteamento no Vercel

```
GET  /api/auth/login      → api/index.js (serverless)
POST /api/watchlist       → api/index.js (serverless)
GET  /qualquer-outra-rota → frontend/dist/index.html (React SPA)
```

O arquivo `vercel.json` configura isso automaticamente.
