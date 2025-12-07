import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"
import { signin } from "../../services/usersService.js";
import { authenticate } from './auth-helper.js';
import { auth } from "../../firebase.js";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
import GoogleIcon from '@mui/icons-material/Google';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Signin = () => {
    const { state } = useLocation();
    const { from } = state || { from: { pathname: '/' } };
    let navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('');
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(formData => ({ ...formData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        signInWithEmailAndPassword(auth, user.email, user.password)
            .then(data => {
                if (data) {
                    const userFB = data.user;
                    console.log(userFB);
                    authenticate(userFB.accessToken, userFB.displayName, () => {
                        navigate(from, { replace: true });
                    })
                } else {
                    setErrorMsg(data.message);
                }
            })
            .catch(err => {
                setErrorMsg(err.message);
                console.log(err);
            });
    };

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
                authenticate(user.accessToken, user.displayName, () => {
                    navigate(from, { replace: true });
                });
            })
            .catch((error) => {
                setErrorMsg(error.message);
                console.log(error);
            });
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="div" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                        Sign In
                    </Typography>

                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
                            {errorMsg}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            {/* Email Field */}
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={user.email || ''}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />

                            {/* Password Field */}
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={user.password || ''}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />

                            {/* Submit Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                startIcon={<LoginIcon />}
                                sx={{ mt: 2 }}
                                disabled
                            >
                                Sign In (Placeholder)
                            </Button>

                            {/* Divider */}
                            <Divider sx={{ my: 2 }}>OR</Divider>

                            {/* Google Sign In Button */}
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                size="large"
                                startIcon={<GoogleIcon />}
                                disabled
                            >
                                Sign in with Google (Placeholder)
                            </Button>

                            {/* Sign Up Link */}
                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Don't have an account?
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/users/signup"
                                    variant="text"
                                    color="primary"
                                    startIcon={<PersonAddIcon />}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Signin;