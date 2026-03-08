import { useState } from 'react'
import LandingPage from '/src/pages/LandingPage'
import LogPage from '/src/pages/LogPage'

export default function App() {
  const [page, setPage] = useState('landing')

  return page === 'landing'
    ? <LandingPage onNavigate={setPage} />
    : <LogPage onNavigate={setPage} />
}
