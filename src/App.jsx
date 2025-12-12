import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css'
import MainRouter from './MainRouter';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </Router>
  )
}

export default App
