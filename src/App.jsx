import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import Layout from './components/layout/Layout'
import LoadingScreen from './components/common/LoadingScreen'

const Home = lazy(() => import('./pages/Home.jsx'))
const Encrypt = lazy(() => import('./pages/Encrypt.jsx'))
const Decrypt = lazy(() => import('./pages/Decrypt.jsx'))
const Education = lazy(() => import('./pages/Education.jsx'))
const Quiz = lazy(() => import('./pages/Quiz.jsx'))
const Chatbot = lazy(() => import('./pages/Chatbot.jsx'))
const Auth = lazy(() => import('./pages/Auth.jsx'))

function App() {
  const { theme } = useThemeStore()

  return (
    <div className={`app ${theme}`}>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="encrypt" element={<Encrypt />} />
            <Route path="decrypt" element={<Decrypt />} />
            <Route path="education" element={<Education />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="auth" element={<Auth />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
