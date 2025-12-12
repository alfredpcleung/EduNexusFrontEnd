import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import * as usersService from '../../services/usersService';

function EditUser() {
    const { uid } = useParams();
    const navigate = useNavigate();
    const { isAuth, user: currentUser, loading: authLoading } = useAuth();

    const [userData, setUserData] = useState({
        displayName: '',
        role: 'student',
        bio: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await usersService.read(uid);
            
            if (response.user) {
                setUserData({
                    displayName: response.user.displayName || '',
                    role: response.user.role || 'student',
                    bio: response.user.bio || '',
                });
            } else if (response.success === false) {
                setError(response.message || 'Failed to load user');
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            setError(err.message || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    }, [uid]);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuth) {
            navigate('/users/signin', { state: { from: `/users/edit/${uid}` } });
            return;
        }

        // Check if user is editing their own profile
        if (currentUser?.uid !== uid && currentUser?.email !== uid) {
            navigate('/users/list');
            return;
        }

        fetchUser();
    }, [uid, isAuth, authLoading, currentUser, navigate, fetchUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.displayName.trim()) {
            setSubmitError('Display name is required');
            return;
        }

        try {
            setLoading(true);
            setSubmitError('');

            const response = await usersService.update(uid, userData);

            if (response.success || response.user) {
                navigate('/users/list');
            } else {
                setSubmitError(response.message || 'Failed to update user');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            if (err.message && err.message.includes('403')) {
                setSubmitError('You are not authorized to edit this user.');
            } else {
                setSubmitError(err.message || 'Failed to update user');
            }
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '500px',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/users/list')}
                    sx={{ mt: 2 }}
                >
                    Back to Users
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Card>
                <CardContent>
                    <h2>Edit Profile</h2>

                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {submitError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Display Name"
                                name="displayName"
                                value={userData.displayName}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="Your full name"
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Role"
                                name="role"
                                value={userData.role}
                                onChange={handleChange}
                                fullWidth
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                                <option value="admin">Admin</option>
                            </TextField>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Bio"
                                name="bio"
                                value={userData.bio}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Tell us about yourself (optional)"
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/users/list')}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default EditUser;
