import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css'
import MainRouter from './MainRouter';

function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <MainRouter />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
