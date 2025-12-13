import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import CourseModel from "../../datasource/CourseModel";
import { update, read } from "../../services/coursesService";
import CourseForm from "./CourseForm";
import { Container, CircularProgress, Alert, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditICourse = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAuth, user, loading: authLoading } = useAuth();
    const [course, setCourse] = useState(new CourseModel());
    const [courseOwner, setCourseOwner] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isForbidden, setIsForbidden] = useState(false);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuth) {
            navigate('/users/signin', { state: { from: { pathname: `/course/edit/${id}` } } });
        }
    }, [isAuth, authLoading, navigate, id]);

    // When the component loads, fetch course data
    useEffect(() => {
        if (!authLoading && isAuth) {
            loadCourse();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isAuth, authLoading]);

    const loadCourse = async () => {
        try {
            setIsLoading(true);
            setErrorMsg('');
            setIsForbidden(false);
            const data = await read(id);
            
            if (data && data.success !== false) {
                const ownerUid = data.owner || data.uid;
                setCourseOwner(ownerUid);

                // Check ownership
                if (user?.uid !== ownerUid) {
                    setErrorMsg("You don't have permission to perform this action.");
                    setIsForbidden(true);
                    setCourse(new CourseModel(
                        data.id || data._id,
                        data.title,
                        data.description,
                        data.credits,
                        data.status,
                        data.instructor
                    ));
                } else {
                    setCourse(new CourseModel(
                        data.id || data._id,
                        data.title,
                        data.description,
                        data.credits,
                        data.status,
                        data.instructor
                    ));
                }
            } else {
                setErrorMsg(data.message || 'Course not found');
            }
        } catch (err) {
            console.error("Error loading course:", err);
            setErrorMsg(err.message || 'Error loading course');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCourse(formData => ({ ...formData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Verify ownership before submission
        if (user?.uid !== courseOwner) {
            setErrorMsg("You don't have permission to perform this action.");
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMsg('');
            setSuccessMsg('');

            const submitCourse = {
                title: course.title,
                description: course.description,
                credits: parseFloat(course.credits) || 0,
                status: course.status,
                instructor: course.instructor
            };

            const data = await update(id, submitCourse);
            
            if (data && data.success) {
                setSuccessMsg(data.message || 'Course updated successfully!');
                // Redirect after short delay to show success message
                setTimeout(() => navigate("/course/list"), 1500);
            } else if (data?.message?.includes("not authorized") || data?.message?.includes("owner")) {
                setErrorMsg("You don't have permission to perform this action.");
            } else {
                setErrorMsg(data.message || 'Failed to update course');
            }
        } catch (err) {
            console.error("Error updating course:", err);
            // Check for 403 Forbidden
            if (err.message?.includes("403") || err.message?.includes("not authorized")) {
                setErrorMsg("You don't have permission to perform this action.");
            } else {
                setErrorMsg(err.message || 'Error updating course');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Container>
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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/course/list")}
                    variant="text"
                >
                    Back to Courses
                </Button>
            </Box>

            {errorMsg && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
                    {errorMsg}
                </Alert>
            )}

            {successMsg && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg('')}>
                    {successMsg}
                </Alert>
            )}

            {/* Always show form, but disable fields if forbidden */}
            <Box sx={{ opacity: isForbidden ? 0.6 : 1, pointerEvents: isForbidden ? 'none' : 'auto' }}>
                <CourseForm
                    course={course}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </Box>
        </Container>
    );
};

export default EditICourse;