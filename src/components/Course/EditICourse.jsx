import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseModel from "../../datasource/CourseModel";
import { update, read } from "../../services/coursesService";
import CourseForm from "./CourseForm";
import { Container, CircularProgress, Alert } from '@mui/material';

const EditICourse = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [course, setCourse] = useState(new CourseModel());
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // When the component loads.
    useEffect(() => {
        read(id).then(data => {
            if (data) {
                setCourse(new CourseModel(
                    data.id || data._id,
                    data.title,
                    data.description,
                    data.credits,
                    data.status,
                    data.instructor
                ));
            } else {
                setErrorMsg(data.message || 'Course not found');
            }
            setIsLoading(false);
        }).catch(err => {
            setErrorMsg(err.message || 'Error loading course');
            console.log(err);
            setIsLoading(false);
        });
    }, [id, navigate]);

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

        update(id, submitCourse)
            .then(data => {
                if (data && data.success) {
                    alert(data.message || 'Course updated successfully');
                    navigate("/course/list");
                } else {
                    setErrorMsg(data.message || 'Failed to update course');
                }
            })
            .catch(err => {
                setErrorMsg(err.message || 'Error updating course');
                console.log(err);
            });
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {errorMsg && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
                    {errorMsg}
                </Alert>
            )}
            <CourseForm
                course={course}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </Container>
    );
};

export default EditICourse;