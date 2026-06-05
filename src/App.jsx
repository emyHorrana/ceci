// App.jsx
// Componente raiz da aplicação CECI.
// Define os providers de contexto globais e as rotas principais.

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Licao from './pages/Licao';

import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { LessonProvider } from './context/LessonContext';

function App() {
  return (
    // UserProvider: gerencia autenticação e dados do usuário logado
    // ProgressProvider: gerencia progresso, módulos e conquistas
    // LessonProvider: gerencia a lição atual sendo cursada
    <UserProvider>
      <ProgressProvider>
        <LessonProvider>
          <BrowserRouter>
            <Routes>
              {/* Página inicial: tela de login */}
              <Route path="/" element={<Login />} />

              {/* Cadastro: criação de nova conta */}
              <Route path="/cadastro" element={<Cadastro />} />

              {/* Dashboard: visão geral do progresso do aluno */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Lição: conteúdo de um módulo específico */}
              <Route path="/licoes/:id" element={<Licao />} />
            </Routes>
          </BrowserRouter>
        </LessonProvider>
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;