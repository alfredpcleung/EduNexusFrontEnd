import React, { useEffect, useState, useRef } from 'react';
import { list } from '../../services/coursesService.js';
import ListItemCourse from './ListItemCourse.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
    Box,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Container,
    Alert,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ListCourse = () => {
    const { isAuth, user } = useAuth();
    const [courseList, setCourseList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const searchTimeoutRef = useRef(null);

    const loadCourses = (search = '', status = '') => {
        // Build query parameters
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        
        // Call backend with query params (fallback to full list if not supported)
        list(params.toString() || undefined).then((data) => {
            if (data && Array.isArray(data)) {
                setCourseList(data || []);
            } else if (data && data.data) {
                setCourseList(data.data || []);
            }
            setIsLoading(false);
        }).catch(err => {
            setErrorMsg(err.message || 'Error loading courses');
            console.log(err);
            setIsLoading(false);
        });
    };

    // When the component loads.
    useEffect(() => {
        loadCourses();
    }, []);

    // Handle search input with debouncing
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
            setIsLoading(true);
            loadCourses(value, statusFilter);
        }, 500);
    };

    // Handle status filter change
    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setIsLoading(true);
        loadCourses(searchTerm, value);
    };

    // When a Course is removed.
    const handleRemove = () => {
        loadCourses(searchTerm, statusFilter);
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header with Add Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Courses
                </Typography>
                {isAuth ? (
                    <Button
                        component={Link}
                        to="/course/add"
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Add Course
                    </Button>
                ) : (
                    <Tooltip title="Sign in to create a course">
                        <span>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                disabled
                            >
                                Add Course
                            </Button>
                        </span>
                    </Tooltip>
                )}
            </Box>

            {/* Error Alert */}
            {errorMsg && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
                    {errorMsg}
                </Alert>
            )}

            {/* Search and Filter Section */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <TextField
                        label="Search Courses"
                        placeholder="Search by title or tags..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Archived">Archived</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Card>

            {/* Courses Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Instructor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Credits</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={40} />
                                    </TableCell>
                                </TableRow>
                            ) : courseList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            {searchTerm || statusFilter ? 'No courses match your search.' : 'No courses found'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courseList.map((course) => (
                                    <ListItemCourse
                                        key={course.id || course._id}
                                        course={course}
                                        onRemoved={handleRemove}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    );
};

export default ListCourse;