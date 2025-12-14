import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
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
import InputAdornment from '@mui/material/InputAdornment';
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
        setErrorMsg(''); // Clear previous error
        const result = await signin(formData.email, formData.password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setErrorMsg(result.message || 'Sign in failed. Please try again.');
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    // Only show one error message, preferring local errorMsg
    const displayError = errorMsg || (authError && !errorMsg ? authError : '');
    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="div" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                        Sign In
                    </Typography>

                    {displayError && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
                            {displayError}
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
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
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
                                    <Link
                                        to="/users/signup"
                                        style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}
                                        onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                                        onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                                    >
                                        Sign Up
                                    </Link>
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