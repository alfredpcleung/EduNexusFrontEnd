import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css'
import MainRouter from './MainRouter';

function App() {

  return (
    <Router>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </Router>
  )
}

export default App
