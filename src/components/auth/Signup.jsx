import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { create } from "../../services/usersService.js";
import UserModel from "../../datasource/userModel.js";
import { auth } from "../../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
    Grid,
    Container,
    Alert,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Signup = () => {
    let navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('');
    const [user, setUser] = useState(new UserModel());
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'password') {
            setPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else {
            setUser(formData => ({ ...formData, [name]: value }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMsg("ERROR: Passwords don't match. Please try again.");
            return;
        }

        try {
            // Create the user with Firebase Authentication
            const userCredentials = await createUserWithEmailAndPassword(auth, user.email, password);
            const userFB = userCredentials.user;
            console.log(userFB);

            await updateProfile(userFB, {
                displayName: user.displayName
            });

            const submitUser = {
                uid: userFB.uid,
                displayName: user.displayName,
                email: user.email,
                role: user.role || 'student',
                bio: user.bio || ''
            };

            create(submitUser)
                .then(data => {
                    if (data && data.success) {
                        alert(data.message || 'User created successfully');
                        navigate('/users/signin');
                    } else {
                        setErrorMsg(data.message || 'Error creating user');
                    }
                })
                .catch(err => {
                    setErrorMsg(err.message || 'Error creating user');
                    console.log(err);
                });
        } catch (err) {
            setErrorMsg(err.message || 'Error during signup');
            console.log(err);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Card elevation={3} sx={{ borderTop: '4px solid #1976d2' }}>
                    <CardHeader
                        title="Create Account"
                        titleTypographyProps={{ variant: 'h5', sx: { fontWeight: 600, textAlign: 'center' } }}
                        sx={{ pb: 2 }}
                    />
                    <Divider />
                    <CardContent sx={{ pt: 3 }}>
                        {errorMsg && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMsg('')}>
                                {errorMsg}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                            {/* Display Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="displayName"
                                    placeholder="Enter your full name"
                                    value={user.displayName || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12}>
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Role */}
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Select
                                        name="role"
                                        value={user.role || 'student'}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#1976d2',
                                            },
                                        }}
                                    >
                                        <MenuItem value="student">Student</MenuItem>
                                        <MenuItem value="instructor">Instructor</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                    <FormHelperText>Select your role</FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Bio */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    placeholder="Tell us about yourself"
                                    value={user.bio || ''}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Password */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter a password"
                                    value={password}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Confirm Password */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Divider before actions */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 2, 
                                    justifyContent: 'flex-end',
                                    mt: 2
                                }}>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        component={Link}
                                        to="/users/signin"
                                        startIcon={<CancelIcon />}
                                        sx={{ 
                                            px: 3,
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<SaveIcon />}
                                        sx={{ 
                                            px: 4,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            '&:hover': {
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                            }
                                        }}
                                        disabled
                                    >
                                        Sign Up (Placeholder)
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Sign In Link */}
                            <Grid item xs={12}>
                                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                    Already have an account?{' '}
                                    <Link to="/users/signin" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 600 }}>
                                        Sign In
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            </Container>
        </Box>
    );
}

export default Signup;