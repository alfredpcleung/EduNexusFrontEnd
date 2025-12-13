import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css'
import MainRouter from './MainRouter';

function App() {

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
