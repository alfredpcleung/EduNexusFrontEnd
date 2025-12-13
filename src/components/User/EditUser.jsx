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
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isForbidden, setIsForbidden] = useState(false);

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

        // Check if user is editing their own profile - allow fetch but mark as forbidden
        if (currentUser?.uid !== uid && currentUser?.email !== uid) {
            setIsForbidden(true);
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

        // Verify ownership before submission
        if (currentUser?.uid !== uid) {
            setSubmitError("You don't have permission to perform this action.");
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError('');
            setSuccessMsg('');

            const response = await usersService.update(uid, userData);

            if (response.success || response.user) {
                setSuccessMsg('Profile updated successfully!');
                // Redirect after short delay to show success message
                setTimeout(() => navigate('/users/list'), 1500);
            } else if (response.message?.includes('not authorized') || response.message?.includes('forbidden')) {
                setSubmitError("You don't have permission to perform this action.");
            } else {
                setSubmitError(response.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            if (err.message?.includes('403') || err.message?.includes('not authorized')) {
                setSubmitError("You don't have permission to perform this action.");
            } else {
                setSubmitError(err.message || 'Failed to update profile');
            }
        } finally {
            setIsSubmitting(false);
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
            <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/users/list')}
                >
                    Back to Users
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/users/list")}
                    variant="text"
                >
                    Back to Users
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                        Edit Profile
                    </Typography>

                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError('')}>
                            {submitError}
                        </Alert>
                    )}

                    {successMsg && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg('')}>
                            {successMsg}
                        </Alert>
                    )}

                    {/* Always show form, but disable if forbidden */}
                    <Box sx={{ opacity: isForbidden ? 0.6 : 1, pointerEvents: isForbidden ? 'none' : 'auto' }}>
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
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="student">Student</option>
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
                                    disabled={isSubmitting}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate('/users/list')}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default EditUser;
