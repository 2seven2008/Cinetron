import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BottomNav, Sidebar } from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import Buscar from "./pages/Buscar";
import MinhaLista from "./pages/MinhaLista";
import Downloads from "./pages/Downloads";
import Perfil from "./pages/Perfil";
import Detail from "./pages/Detail";
import { Configuracoes, Privacidade, Ajuda } from "./pages/SubPages";
import "./styles/components.css";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="full-spinner">
        <div className="spinner" />
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="full-spinner">
        <div className="spinner" />
      </div>
    );

  const isAuth = ["/login", "/cadastro", "/esqueci-senha"].includes(
    window.location.pathname,
  );

  return (
    <div className={`app-layout${isAuth ? " app-layout--auth" : ""}`}>
      {user && !isAuth && <Sidebar />}
      <div className="main-area">
        <Routes>
          {/* Auth */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/cadastro"
            element={!user ? <Cadastro /> : <Navigate to="/" />}
          />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />

          {/* App */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/buscar"
            element={
              <PrivateRoute>
                <Buscar />
              </PrivateRoute>
            }
          />
          <Route
            path="/lista"
            element={
              <PrivateRoute>
                <MinhaLista />
              </PrivateRoute>
            }
          />
          <Route
            path="/downloads"
            element={
              <PrivateRoute>
                <Downloads />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <Configuracoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/privacidade"
            element={
              <PrivateRoute>
                <Privacidade />
              </PrivateRoute>
            }
          />
          <Route
            path="/ajuda"
            element={
              <PrivateRoute>
                <Ajuda />
              </PrivateRoute>
            }
          />

          {/* Detail */}
          <Route
            path="/filme/:id"
            element={
              <PrivateRoute>
                <Detail type="filme" />
              </PrivateRoute>
            }
          />
          <Route
            path="/serie/:id"
            element={
              <PrivateRoute>
                <Detail type="serie" />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {user && <BottomNav />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
