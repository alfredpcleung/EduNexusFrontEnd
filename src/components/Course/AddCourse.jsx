import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import CourseModel from "../../datasource/CourseModel";
import { create } from "../../services/coursesService";
import CourseForm from "./CourseForm";
import { COURSE_LABELS, formatLabelsForSubmission } from "../../utils/feedbackLabels";
import { Container, Alert, Box, CircularProgress, Typography, Snackbar, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddCourse = () => {
    const navigate = useNavigate();
    const { isAuth, user, loading } = useAuth();
    const [course, setCourse] = useState(new CourseModel());
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedLabels, setSelectedLabels] = useState([]);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!loading && !isAuth) {
            navigate('/users/signin', { state: { from: { pathname: '/course/add' } } });
        }
    }, [isAuth, loading, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCourse(formData => ({ ...formData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitting course: ", course);

        const submitCourse = {
            title: course.title,
            description: course.description,
            credits: parseFloat(course.credits) || 0,
            status: course.status,
            instructor: course.instructor,
            labels: formatLabelsForSubmission(selectedLabels)
        };

        create(submitCourse)
            .then(data => {
                if (data && data.title) {
                    // Backend returns the created course object directly
                    setSuccessMsg(`Course "${data.title}" added successfully!`);
                    setOpenSnackbar(true);
                    // Redirect after snackbar auto-dismisses
                    setTimeout(() => navigate("/course/list"), 2000);
                } else if (data && (data.success === false || data.error)) {
                    setErrorMsg(data.message || 'Failed to create course');
                } else if (data?.message?.includes("not authorized")) {
                    setErrorMsg(data.message || 'You do not have permission to create this course.');
                } else {
                    setErrorMsg('Unexpected response from server');
                }
            })
            .catch(err => {
                // Handle HTTP status codes
                if (err.status === 403) {
                    setErrorMsg(err.message || 'You do not have permission to create this course.');
                } else if (err.message?.includes("403") || err.message?.includes("not authorized")) {
                    setErrorMsg('You do not have permission to create this course.');
                } else if (err.message?.includes("404")) {
                    setErrorMsg('Course creation endpoint not found. Please check your account permissions.');
                } else {
                    setErrorMsg(err.message || 'Error creating course');
                }
                console.log(err);
            });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuth) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>Redirecting to sign in...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 4
        }}>
            <Container maxWidth="sm">
                {errorMsg && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 3, borderRadius: 2 }} 
                        onClose={() => setErrorMsg('')}
                    >
                        {errorMsg}
                    </Alert>
                )}
                <CourseForm
                    course={course}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    selectedLabels={selectedLabels}
                    onLabelsChange={setSelectedLabels}
                />
            </Container>
            <Snackbar 
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={successMsg}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default AddCourse;