import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Licao from './pages/Licao'

import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { LessonProvider } from './context/LessonContext'

function App() {
  return (
    <UserProvider>
      <ProgressProvider>
        <LessonProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/licoes/:id" element={<Licao />} />
            </Routes>
          </BrowserRouter>
        </LessonProvider>
      </ProgressProvider>
    </UserProvider>
  )
}

export default App