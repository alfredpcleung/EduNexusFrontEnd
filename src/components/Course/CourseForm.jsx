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
import { COURSE_LABELS } from '../../utils/feedbackLabels';

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
                        <Grid container spacing={3}>
                            {/* Course Title */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Course Title"
                                    name="title"
                                    placeholder="Enter the course title"
                                    value={course.title || ""}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Instructor */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instructor Name"
                                    name="instructor"
                                    placeholder="Enter the instructor name"
                                    value={course.instructor || ""}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Credits and Status Row */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Credits"
                                    name="credits"
                                    type="number"
                                    placeholder="0"
                                    value={course.credits || 0}
                                    onChange={handleChange}
                                    inputProps={{ min: 0, step: 0.5 }}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <Select
                                        name="status"
                                        value={course.status || 'active'}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#1976d2',
                                            },
                                        }}
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                        <MenuItem value="archived">Archived</MenuItem>
                                    </Select>
                                    <FormHelperText>Course Status</FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Course Description"
                                    name="description"
                                    placeholder="Describe what students will learn in this course..."
                                    value={course.description || ""}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Feedback Labels */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                        Course Labels (select up to 3)
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {COURSE_LABELS.map(label => (
                                            <Chip
                                                key={label}
                                                label={label}
                                                onClick={() => {
                                                    const updated = selectedLabels.includes(label)
                                                        ? selectedLabels.filter(l => l !== label)
                                                        : selectedLabels.length < 3
                                                        ? [...selectedLabels, label]
                                                        : selectedLabels;
                                                    if (onLabelsChange) onLabelsChange(updated);
                                                }}
                                                color={selectedLabels.includes(label) ? 'primary' : 'default'}
                                                variant={selectedLabels.includes(label) ? 'filled' : 'outlined'}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Stack>
                                    <FormHelperText>
                                        {selectedLabels.length}/3 labels selected
                                    </FormHelperText>
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