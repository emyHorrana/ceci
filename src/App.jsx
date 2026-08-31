// App.jsx
// Componente raiz da aplicação CECI.

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login      from './pages/Login';
import Cadastro   from './pages/Cadastro';
import Dashboard  from './pages/Dashboard';
import Modulos    from './pages/Modulos';
import Conquistas from './pages/Conquistas';
import Perfil     from './pages/Perfil';
import Licao      from './pages/Licao';
import MiniModulo from './pages/MiniModulo';
import UnidadeCheckpoint from './pages/UnidadeCheckpoint';
import BoasVindas from './pages/BoasVindas';

import { UserProvider }     from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { LessonProvider }   from './context/LessonContext';
import { TextSizeProvider } from './context/TextSizeContext';
import { TextSizeControl }  from './components/Accessibility/TextSizeControl';

function App() {
  return (
    <TextSizeProvider>
      <UserProvider>
        <ProgressProvider>
          <LessonProvider>
            <BrowserRouter>
              {/* Fora das <Routes> de propósito - precisa aparecer em
                  QUALQUER tela (login, boas-vindas, dashboard, lição),
                  não só nas internas. Ver comentário em
                  TextSizeControl.jsx. */}
              <TextSizeControl />

              <Routes>
                {/* Página inicial: tela de login */}
                <Route path="/"          element={<Login />} />

                {/* Boas-vindas: apresentação da Ceci + diagnóstico inicial */}
                {/* Acesso livre por enquanto, pra facilitar o desenvolvimento */}
                <Route path="/boas-vindas" element={<BoasVindas />} />

                {/* Cadastro: criação de nova conta */}
                <Route path="/cadastro"  element={<Cadastro />} />

                {/* Dashboard: visão geral do progresso do aluno */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Módulos: listagem dos módulos do currículo */}
                <Route path="/modulos"   element={<Modulos />} />

                {/* Conquistas: catálogo completo (desbloqueadas e não) */}
                <Route path="/conquistas" element={<Conquistas />} />

                {/* Perfil: dados básicos (editáveis) + resumo de
                    conquistas/streak. Já existia como item de
                    navegação na sidebar (AppLayout.jsx), sem rota. */}
                <Route path="/perfil" element={<Perfil />} />

                {/* Mini-módulo: estudo de uma lição específica */}
                {/* Ex: /mini-modulo/1-1  →  módulo 1, mini-módulo 1 */}
                <Route path="/mini-modulo/:miniModuloId" element={<MiniModulo />} />

                {/* Desafio de fim de Unidade: jogo mais difícil
                    (associação/quiz) que dá o veredito de domínio da
                    Unidade inteira. Ver data/unidades.js (campo
                    `checkpoint`) e pages/UnidadeCheckpoint.jsx. */}
                <Route path="/unidade/:unidadeId/checkpoint" element={<UnidadeCheckpoint />} />

                {/* Lição legada (mantida por compatibilidade) */}
                <Route path="/licoes/:id" element={<Licao />} />
              </Routes>
            </BrowserRouter>
          </LessonProvider>
        </ProgressProvider>
      </UserProvider>
    </TextSizeProvider>
  );
}

export default App;