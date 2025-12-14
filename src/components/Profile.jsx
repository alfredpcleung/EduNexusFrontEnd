import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { read, update } from '../services/usersService';
import useAutosave from '../hooks/useAutosave';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack
} from '@mui/material';

const Profile = () => {
        // ...existing state and function declarations...

        // ...existing state and function declarations...

        // ...existing state and function declarations...


    const navigate = useNavigate();
    const { user: authUser, loading: authLoading } = useAuth();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const isDirty = useRef(false);

    // Debug the Router context
    console.log('useNavigate context:', useNavigate);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!authUser || !authUser.uid) {
                    setLoading(false);
                    return;
                }
                const userId = authUser.uid;
                const response = await read(userId);
                // Support both {success, data} and direct user object
                const userData = response && response.data ? response.data : response;
                setUser(userData);
                setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    school: userData.school,
                    fieldOfStudy: userData.fieldOfStudy,
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
        if (!authLoading) fetchUser();
    }, [authUser, authLoading]);

    // Warn on unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (editMode && isDirty.current) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [editMode]);

    const validateUrls = (data) => {
        const newErrors = {};
        // Regex patterns
        const githubPattern = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+$/;
        const linkedinPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/;
        const websitePattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

        // Required and maxLength checks
        if (!data.firstName || data.firstName.length > 50) {
            newErrors.firstName = !data.firstName ? 'First name is required' : 'First name must be at most 50 characters';
        }
        if (!data.lastName || data.lastName.length > 50) {
            newErrors.lastName = !data.lastName ? 'Last name is required' : 'Last name must be at most 50 characters';
        }
        if (!data.school || data.school.length > 50) {
            newErrors.school = !data.school ? 'School is required' : 'School must be at most 50 characters';
        }
        if (!data.fieldOfStudy || data.fieldOfStudy.length > 50) {
            newErrors.fieldOfStudy = !data.fieldOfStudy ? 'Program is required' : 'Program must be at most 50 characters';
        }
        if (data.bio && data.bio.length > 500) {
            newErrors.bio = 'Bio must be at most 500 characters';
        }
        if (data.github && !githubPattern.test(data.github)) {
            newErrors.github = 'Please enter a valid GitHub URL';
        }
        if (data.linkedin && !linkedinPattern.test(data.linkedin)) {
            newErrors.linkedin = 'Please enter a valid LinkedIn URL';
        }
        if (data.personalWebsite && !websitePattern.test(data.personalWebsite)) {
            newErrors.personalWebsite = 'Please provide a valid website URL';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);
        setErrors(validateUrls(updatedForm));
        isDirty.current = true;
    };

    const handleSave = async () => {
        // Only save if dirty (user has made a change)
        if (!isDirty.current) return;
        const validationErrors = validateUrls(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        try {
            if (!authUser || !authUser.uid) return;
            const userId = authUser.uid;
            // Map frontend fields to backend keys
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                school: formData.school,
                fieldOfStudy: formData.fieldOfStudy,
                github: formData.github,
                personalWebsite: formData.personalWebsite,
                linkedin: formData.linkedin,
                bio: formData.bio,
                profilePic: formData.profilePic
            };
            await update(userId, payload);
            setUser(payload);
            setEditMode(false);
            setSuccessMsg('Profile updated successfully!');
            isDirty.current = false;
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleCancel = () => {
        if (isDirty.current) {
            if (window.confirm('You have unsaved changes. Discard changes?')) {
                setFormData(user);
                setEditMode(false);
                setErrors({});
                isDirty.current = false;
            }
        } else {
            setFormData(user);
            setEditMode(false);
            setErrors({});
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 0 }}>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, mt: 0 }}>
                            Profile
                        </Typography>
                    </Box>
                    {successMsg && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="success.main">{successMsg}</Typography>
                        </Box>
                    )}
                    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                        <Stack spacing={3}>
                            {/* First Name */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="firstName">
                                    First Name <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        value={formData.firstName || ''}
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 50 }}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.firstName || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* Last Name */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="lastName">
                                    Last Name <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        value={formData.lastName || ''}
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 50 }}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.lastName || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* School */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="school">
                                    School <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="school"
                                        name="school"
                                        placeholder="Enter your school"
                                        value={formData.school || ''}
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 50 }}
                                        error={!!errors.school}
                                        helperText={errors.school}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.school || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* Program */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="fieldOfStudy">
                                    Program <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="fieldOfStudy"
                                        name="fieldOfStudy"
                                        placeholder="Enter your program"
                                        value={formData.fieldOfStudy || ''}
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 50 }}
                                        error={!!errors.fieldOfStudy}
                                        helperText={errors.fieldOfStudy}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.fieldOfStudy || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* GitHub */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="github">
                                    GitHub
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="github"
                                        name="github"
                                        placeholder="Enter your GitHub URL"
                                        value={formData.github || ''}
                                        onChange={handleChange}
                                        error={!!errors.github}
                                        helperText={errors.github}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.github || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* Personal Website */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="personalWebsite">
                                    Personal Website
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="personalWebsite"
                                        name="personalWebsite"
                                        placeholder="Enter your website URL"
                                        value={formData.personalWebsite || ''}
                                        onChange={handleChange}
                                        error={!!errors.personalWebsite}
                                        helperText={errors.personalWebsite}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.personalWebsite || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* LinkedIn */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="linkedin">
                                    LinkedIn
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="linkedin"
                                        name="linkedin"
                                        placeholder="Enter your LinkedIn URL"
                                        value={formData.linkedin || ''}
                                        onChange={handleChange}
                                        error={!!errors.linkedin}
                                        helperText={errors.linkedin}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.linkedin || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* Bio */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="bio">
                                    Bio
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="bio"
                                        name="bio"
                                        placeholder="Tell us about yourself"
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        multiline
                                        minRows={2}
                                        inputProps={{ maxLength: 500 }}
                                        error={!!errors.bio}
                                        helperText={errors.bio ? errors.bio : `${formData.bio ? formData.bio.length : 0}/500`}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.bio || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            {/* Profile Picture URL */}
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="profilePic">
                                    Profile Picture URL
                                </Typography>
                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        id="profilePic"
                                        name="profilePic"
                                        placeholder="Paste your profile picture URL"
                                        value={formData.profilePic || ''}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                                        {formData.profilePic || <span style={{ color: '#aaa' }}>Not set</span>}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                {!editMode ? (
                                    <Button fullWidth variant="contained" color="primary" onClick={() => {
                                        isDirty.current = false;
                                        setEditMode(true);
                                    }}>
                                        Edit
                                    </Button>
                                ) : (
                                    <>
                                        <Button fullWidth variant="contained" color="primary" type="submit">
                                            Save
                                        </Button>
                                        <Button fullWidth variant="outlined" color="secondary" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile;