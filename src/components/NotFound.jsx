import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';

function NotFound() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
                <ErrorIcon sx={{ fontSize: 80, color: '#d32f2f' }} />
            </Box>
            <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                404
            </Typography>
            <Typography variant="h5" component="h2" sx={{ mb: 2, color: 'textSecondary' }}>
                Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'textSecondary' }}>
                Sorry, the page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
            >
                Go to Home
            </Button>
        </Container>
    );
}

export default NotFound;