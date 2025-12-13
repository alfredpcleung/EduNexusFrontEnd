import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { useAuth } from './AuthContext.jsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Container,
    Alert,
    Stack,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';

const Signup = () => {
    let navigate = useNavigate();
    const { signup, loading, error: authError } = useAuth();

    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        school: '',
        fieldOfStudy: '',
        role: 'student' // still fixed to student, but not shown in UI
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation

        if (!formData.firstName.trim()) {
            setErrorMsg("ERROR: First name is required.");
            return;
        }
        if (!formData.lastName.trim()) {
            setErrorMsg("ERROR: Last name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setErrorMsg("ERROR: Email is required.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("ERROR: Passwords don't match. Please try again.");
            return;
        }

        if (formData.password.length < 6) {
            setErrorMsg("ERROR: Password must be at least 6 characters long.");
            return;
        }

        // Generate a simple UID from email (backend will also generate one if needed)
        const uid = formData.email.split('@')[0] + '_' + Date.now();

        // Call signup from AuthContext

        const result = await signup(
            uid,
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password,
            formData.role,
            formData.school,
            formData.fieldOfStudy
        );

        if (result.success) {
            // Redirect to home page after successful signup
            navigate('/');
        } else {
            setErrorMsg(result.message || 'Error creating account');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="div" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                        Create Account
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
                            {/* First Name */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    First Name <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    value={formData.firstName || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                            {/* Last Name */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Last Name <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    value={formData.lastName || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                            {/* School (optional) */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    School (optional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="school"
                                    placeholder="Enter your school (optional)"
                                    value={formData.school || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                            {/* Field of Study (optional) */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Field of Study (optional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="fieldOfStudy"
                                    placeholder="Enter your field of study (optional)"
                                    value={formData.fieldOfStudy || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            {/* Email */}
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

                            {/* Password */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Password <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    placeholder="Enter a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            {/* Confirm Password */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Confirm Password <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
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
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>

                            {/* Sign In Link */}
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Box
                                        component={Link}
                                        to="/users/signin"
                                        sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        Sign In
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

export default Signup;