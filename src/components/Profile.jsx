import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { read, update } from '../services/usersService';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid
} from '@mui/material';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = 'current-user-id'; // Replace with actual user ID retrieval logic
                const userData = await read(userId);
                setUser(userData);
                setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    schoolName: userData.schoolName,
                    programName: userData.programName,
                    github: userData.github,
                    personalWebsite: userData.personalWebsite,
                    linkedin: userData.linkedin,
                    bio: userData.bio,
                    profilePic: userData.profilePic
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const userId = 'current-user-id'; // Replace with actual user ID retrieval logic
            await update(userId, formData);
            navigate('/'); // Redirect after saving
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    useEffect(() => {
        const autosave = setInterval(async () => {
            try {
                const userId = 'current-user-id'; // Replace with actual user ID retrieval logic
                await update(userId, formData);
                console.log('Autosave successful');
            } catch (error) {
                console.error('Autosave failed:', error);
            }
        }, 30000); // Autosave every 30 seconds

        return () => clearInterval(autosave);
    }, [formData]);

    const handleCancel = () => {
        if (JSON.stringify(formData) !== JSON.stringify(user)) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Profile
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="School"
                            name="schoolName"
                            value={formData.schoolName || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Program"
                            name="programName"
                            value={formData.programName || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="GitHub"
                            name="github"
                            value={formData.github || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Personal Website"
                            name="personalWebsite"
                            value={formData.personalWebsite || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="LinkedIn"
                            name="linkedin"
                            value={formData.linkedin || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Profile Picture URL"
                            name="profilePic"
                            value={formData.profilePic || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    {/* Add placeholder for profile picture preview */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <img
                                src={formData.profilePic || 'https://via.placeholder.com/150'}
                                alt="Profile Preview"
                                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;