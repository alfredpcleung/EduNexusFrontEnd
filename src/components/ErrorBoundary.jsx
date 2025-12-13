import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </Typography>
            {this.state.error && (
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: '#f5f5f5', 
                borderRadius: 1, 
                textAlign: 'left',
                mb: 4
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Error Details:
                </Typography>
                <Typography 
                  variant="body2" 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word',
                    fontSize: '0.75rem',
                    color: '#d32f2f',
                    fontFamily: 'monospace'
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={this.handleReset}
            >
              Go Home
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
