import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseModel from "../../datasource/CourseModel";
import { create } from "../../services/coursesService";
import CourseForm from "./CourseForm";
import { Container, Alert, Box } from '@mui/material';

const AddCourse = () => {
    const navigate = useNavigate();
    const [course, setCourse] = useState(new CourseModel());
    const [errorMsg, setErrorMsg] = useState('');

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