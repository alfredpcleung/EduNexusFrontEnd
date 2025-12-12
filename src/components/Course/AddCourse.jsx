import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import CourseModel from "../../datasource/CourseModel";
import { create } from "../../services/coursesService";
import CourseForm from "./CourseForm";
import { Container, Alert, Box, CircularProgress, Typography } from '@mui/material';

const AddCourse = () => {
    const navigate = useNavigate();
    const { isAuth, loading } = useAuth();
    const [course, setCourse] = useState(new CourseModel());
    const [errorMsg, setErrorMsg] = useState('');

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
            instructor: course.instructor
        };

        create(submitCourse)
            .then(data => {
                if (data && data.title) {
                    // Backend returns the created course object directly
                    alert(`Course added successfully: ${data.title}`);
                    navigate("/course/list");
                } else if (data && (data.success === false || data.error)) {
                    setErrorMsg(data.message || 'Failed to create course');
                } else {
                    setErrorMsg('Unexpected response from server');
                }
            })
            .catch(err => {
                setErrorMsg(err.message || 'Error creating course');
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
                />
            </Container>
        </Box>
    );
};

export default AddCourse;