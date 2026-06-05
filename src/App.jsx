// App.jsx
// Componente raiz da aplicação CECI.

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login      from './pages/Login';
import Cadastro   from './pages/Cadastro';
import Dashboard  from './pages/Dashboard';
import Licao      from './pages/Licao';
import MiniModulo from './pages/MiniModulo';

import { UserProvider }     from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { LessonProvider }   from './context/LessonContext';

function App() {
  return (
    <UserProvider>
      <ProgressProvider>
        <LessonProvider>
          <BrowserRouter>
            <Routes>
              {/* Página inicial: tela de login */}
              <Route path="/"          element={<Login />} />

              {/* Cadastro: criação de nova conta */}
              <Route path="/cadastro"  element={<Cadastro />} />

              {/* Dashboard: visão geral do progresso do aluno */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Mini-módulo: estudo de uma lição específica */}
              {/* Ex: /mini-modulo/1-1  →  módulo 1, mini-módulo 1 */}
              <Route path="/mini-modulo/:miniModuloId" element={<MiniModulo />} />

              {/* Lição legada (mantida por compatibilidade) */}
              <Route path="/licoes/:id" element={<Licao />} />
            </Routes>
          </BrowserRouter>
        </LessonProvider>
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;