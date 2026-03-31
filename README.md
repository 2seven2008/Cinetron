# 🎬 CINETRON

Plataforma de streaming completa com React + Node.js + MongoDB + TMDB API.

---

## 📁 Estrutura do Projeto

```
cinetron/
├── frontend/   → React + Vite
└── backend/    → Node.js + Express + MongoDB
```

---

## 🚀 Como Rodar (Passo a Passo)

### PASSO 1 — Chave gratuita da TMDB (obrigatório)

1. Acesse: https://www.themoviedb.org/signup
2. Crie uma conta gratuita (não precisa de cartão)
3. Vá em: https://www.themoviedb.org/settings/api
4. Clique em **"Create"** → escolha **"Developer"**
5. Preencha o formulário (pode colocar qualquer site/app)
6. Copie a **API Key (v3 auth)**

---

### PASSO 2 — MongoDB Atlas (gratuito)

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um cluster **FREE (M0)**
4. Em **Database Access**: crie um usuário com senha
5. Em **Network Access**: adicione `0.0.0.0/0` (aceitar todos os IPs)
6. Clique em **Connect** → **Compass** → copie a connection string
   - Formato: `mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/cinetron`

---

### PASSO 3 — Configurar o Backend

```bash
cd cinetron/backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

Edite o arquivo `.env`:
```
MONGO_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.xxxxx.mongodb.net/cinetron
JWT_SECRET=qualquer_string_secreta_longa_aqui
PORT=5000
FRONTEND_URL=http://localhost:5173
```

```bash
# Rodar o backend
npm run dev
```

✅ Você verá: `✅ MongoDB connected` e `🚀 Server running on port 5000`

---

### PASSO 4 — Configurar o Frontend

```bash
cd cinetron/frontend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

Edite o arquivo `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=SUA_CHAVE_TMDB_DO_PASSO_1
```

```bash
# Rodar o frontend
npm run dev
```

✅ Abra: http://localhost:5173

---

## 🌐 Deploy em Produção

### Frontend → Vercel (gratuito)
1. Acesse: https://vercel.com
2. Importe o repositório → selecione a pasta `frontend`
3. Adicione as variáveis de ambiente:
   - `VITE_API_URL` = URL do seu backend
   - `VITE_TMDB_API_KEY` = sua chave TMDB

### Backend → Railway (gratuito)
1. Acesse: https://railway.app
2. Importe o repositório → selecione a pasta `backend`
3. Adicione as variáveis de ambiente do `.env.example`
4. Copie a URL gerada e use como `VITE_API_URL` no Vercel

---

## 🎯 Funcionalidades

| Tela | Descrição |
|------|-----------|
| Login | Autenticação com JWT |
| Cadastro | Criar nova conta |
| Esqueci Senha | Recuperação de senha |
| Home | Hero em alta + seções de conteúdo da TMDB |
| Buscar | Busca em tempo real + filtro por gênero |
| Detalhes | Poster, sinopse, elenco, trailer, episódios |
| Minha Lista | Salvar filmes/séries favoritos |
| Downloads | Marcar para ver offline |
| Perfil | Dados do usuário + menu |
| Configurações | Idioma, cache, dispositivos |
| Privacidade | Política de dados |
| Ajuda | FAQ interativo |

---

## 📱 Responsivo

- **Mobile**: bottom navigation bar
- **Desktop (768px+)**: sidebar lateral

---

## 🔧 Tecnologias

- **Frontend**: React 18, React Router v6, Axios, Lucide Icons, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- **API**: TMDB (The Movie Database) — gratuita
- **Fontes**: Bebas Neue + Outfit (Google Fonts)
