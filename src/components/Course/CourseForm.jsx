import React from "react";
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    Divider,
    Paper,
    Chip,
    Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const CourseForm = ({ course = {}, handleChange, handleSubmit, selectedLabels = [], onLabelsChange }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ maxWidth: 700, margin: '0 auto', py: 4 }}>
            <Card elevation={3} sx={{ borderTop: '4px solid #1976d2' }}>
                <CardHeader
                    title={course.id ? 'Edit Course' : 'Create New Course'}
                    titleTypographyProps={{ variant: 'h5', sx: { fontWeight: 600 } }}
                    sx={{ pb: 2 }}
                />
                <Divider />
                <CardContent sx={{ pt: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3} direction="column">
                            {/* School */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="school">
                                    School
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="school"
                                    name="school"
                                    placeholder="Enter the school name"
                                    value={course.school || ""}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ maxLength: 50 }}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Course Subject */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="courseSubject">
                                    Course Subject
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="courseSubject"
                                    name="courseSubject"
                                    placeholder="e.g. CS"
                                    value={course.courseSubject || ""}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ pattern: '[A-Z]{2,5}', maxLength: 5 }}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Course Number */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="courseNumber">
                                    Course Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="courseNumber"
                                    name="courseNumber"
                                    placeholder="e.g. 101"
                                    value={course.courseNumber || ""}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ pattern: '\\d{2,4}', maxLength: 4 }}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Title */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="title">
                                    Course Title
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="title"
                                    name="title"
                                    placeholder="Enter the course title"
                                    value={course.title || ""}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Description */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="description">
                                    Course Description
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    placeholder="Describe what students will learn in this course..."
                                    value={course.description || ""}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Credits */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="credits">
                                    Credits
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="credits"
                                    name="credits"
                                    type="number"
                                    placeholder="4"
                                    value={course.credits || 4}
                                    onChange={handleChange}
                                    inputProps={{ min: 0, max: 12 }}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Syllabus Revision Date */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="syllabusRevisionDate">
                                    Syllabus Revision Date
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="syllabusRevisionDate"
                                    name="syllabusRevisionDate"
                                    type="date"
                                    value={course.syllabusRevisionDate ? course.syllabusRevisionDate.substring(0, 10) : ''}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Prerequisites */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="prerequisites">
                                    Prerequisites (comma separated)
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="prerequisites"
                                    name="prerequisites"
                                    placeholder="e.g. CS100, MATH101"
                                    value={Array.isArray(course.prerequisites) ? course.prerequisites.join(', ') : course.prerequisites || ''}
                                    onChange={e => handleChange({ target: { name: 'prerequisites', value: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Corequisites */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="corequisites">
                                    Corequisites (comma separated)
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="corequisites"
                                    name="corequisites"
                                    placeholder="e.g. PHYS101"
                                    value={Array.isArray(course.corequisites) ? course.corequisites.join(', ') : course.corequisites || ''}
                                    onChange={e => handleChange({ target: { name: 'corequisites', value: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Status */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="status">
                                    Course Status
                                </Typography>
                                <FormControl fullWidth variant="outlined">
                                    <Select
                                        id="status"
                                        name="status"
                                        value={course.status || 'active'}
                                        onChange={handleChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                        <MenuItem value="archived">Archived</MenuItem>
                                    </Select>
                                    <FormHelperText>Course Status</FormHelperText>
                                </FormControl>
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
                                        onClick={() => navigate(-1)}
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
                                    >
                                        Save Course
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CourseForm;