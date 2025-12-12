import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"
import { useAuth } from './AuthContext.jsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Grid,
    Container,
    Alert,
    Divider,
    Stack,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Signin = () => {
    const { state } = useLocation();
    const { from } = state || { from: { pathname: '/' } };
    let navigate = useNavigate();
    const { signin, loading, error: authError } = useAuth();

    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const result = await signin(formData.email, formData.password);

        if (result.success) {
            // Redirect to the page user was trying to access or home
            navigate(from, { replace: true });
        } else {
            setErrorMsg(result.message || 'Sign in failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="div" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                        Sign In
                    </Typography>

                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
                            {errorMsg}
                        </Alert>
                    )}
                    {authError && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
                            {authError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Email Field */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Email <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            {/* Password Field */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Password <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            {/* Submit Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                sx={{ mt: 3 }}
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            {/* Sign Up Link */}
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2">
                                    Don't have an account?{' '}
                                    <Box
                                        component={Link}
                                        to="/users/signup"
                                        sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        Sign Up
                                    </Box>
                                </Typography>
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Signin;