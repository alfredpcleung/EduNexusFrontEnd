import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './auth/auth-helper';
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Stack,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputAdornment,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import * as coursesService from '../services/coursesService';
import * as usersService from '../services/usersService';
import * as projectsService from '../services/projectsService';

function Home() {
    const navigate = useNavigate();
    const isAuth = isAuthenticated();
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        projects: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchType, setSearchType] = useState('course');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [coursesData, usersData, projectsData] = await Promise.all([
                    coursesService.list(),
                    usersService.list(),
                    projectsService.list(),
                ]);

                setStats({
                    students: Array.isArray(usersData) ? usersData.length : (usersData?.data?.length || 0),
                    courses: Array.isArray(coursesData) ? coursesData.length : (coursesData?.data?.length || 0),
                    projects: Array.isArray(projectsData) ? projectsData.length : (projectsData?.data?.length || 0),
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
                setStats({ students: 0, courses: 0, projects: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        if (searchType === 'course') {
            navigate(`/course/list?search=${encodeURIComponent(searchQuery)}`);
        } else if (searchType === 'student') {
            navigate(`/users/list?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const keyBenefits = [
        {
            icon: <VerifiedUserIcon sx={{ fontSize: 48 }} />,
            title: 'Choose the Right Teammates',
            description: 'Avoid frustration with group projects — see peer ratings and pick reliable collaborators in advance.',
            color: '#667eea',
        },
        {
            icon: <StarIcon sx={{ fontSize: 48 }} />,
            title: 'Discover the Best Electives',
            description: 'Learn from student feedback to select electives that match your interests and maximize your GPA.',
            color: '#ec4899',
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
            title: 'Get Insights on Core Courses',
            description: 'Know what challenges to expect, which topics demand extra focus, and how to succeed in required classes.',
            color: '#f59e0b',
        },
        {
            icon: <RateReviewIcon sx={{ fontSize: 48 }} />,
            title: 'Share and Benefit from Peer Feedback',
            description: 'Contribute your own experiences and tap into a community of reviews to make smarter academic choices.',
            color: '#10b981',
        },
    ];

    const platformCards = [
        {
            icon: <BookIcon sx={{ fontSize: 48 }} />,
            title: 'Browse Courses',
            description: 'Explore courses with peer ratings and detailed feedback to help you choose wisely.',
            color: '#667eea',
            path: '/course/list',
            buttonLabel: 'View Courses',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            icon: <PersonIcon sx={{ fontSize: 48 }} />,
            title: 'Connect with Peers',
            description: 'Find teammates and colleagues based on verified credentials and peer reviews.',
            color: '#ec4899',
            path: '/users/list',
            buttonLabel: 'View Profiles',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
        },
        {
            icon: <FolderIcon sx={{ fontSize: 48 }} />,
            title: 'Showcase Projects',
            description: 'View student projects and showcase your own work with peer collaboration feedback.',
            color: '#f59e0b',
            path: '/project/list',
            buttonLabel: 'View Projects',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Hero Section with Gradient Background - No gap from navbar */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: { xs: 6, md: 10 },
                    pt: 0,
                    pb: { xs: 6, md: 10 },
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    mt: 0,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.1,
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            letterSpacing: '-1px'
                        }}
                    >
                        Welcome to EduNexus
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            mb: 4,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            fontWeight: 500,
                            opacity: 0.95,
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        Your LinkedIn for teamwork • Your RateMyProfessor for courses
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 4,
                            opacity: 0.9,
                            maxWidth: '700px',
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontSize: '1rem'
                        }}
                    >
                        Find reliable teammates, discover great courses, and share peer feedback. 
                        Make smarter choices about who you collaborate with and what you learn.
                    </Typography>
                    
                    {!isAuth && (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center', mt: 5 }}>
                            <Button
                                variant="contained"
                                color="inherit"
                                size="large"
                                onClick={() => navigate('/users/signup')}
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#667eea',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                endIcon={<ArrowForwardIcon />}
                            >
                                Create Account
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderColor: 'white',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                size="large"
                                onClick={() => navigate('/users/signin')}
                            >
                                Sign In
                            </Button>
                        </Stack>
                    )}
                </Container>
            </Box>

            {/* Search Section */}
            <Box sx={{ py: 8, backgroundColor: 'white' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                color: '#1a202c'
                            }}
                        >
                            Find Your Next Discovery
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            sx={{ 
                                maxWidth: '500px', 
                                mx: 'auto', 
                                lineHeight: 1.8,
                                fontSize: '1rem',
                                fontWeight: 500,
                                mb: 4
                            }}
                        >
                            Search for courses or find teammates to collaborate with
                        </Typography>

                        {/* Search Engine */}
                        <Box
                            component="form"
                            onSubmit={handleSearch}
                            sx={{
                                display: 'flex',
                                gap: 1,
                                maxWidth: '600px',
                                mx: 'auto',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'stretch'
                            }}
                        >
                            <FormControl sx={{ minWidth: 140 }}>
                                <Select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    sx={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        fontWeight: 500,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#e5e7eb'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#667eea'
                                        }
                                    }}
                                >
                                    <MenuItem value="course">Search Courses</MenuItem>
                                    <MenuItem value="student">Find Teammates</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                placeholder={searchType === 'course' ? 'Enter course name or code...' : 'Enter student name...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        '& fieldset': {
                                            borderColor: '#e5e7eb'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#9ca3af' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.75,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: '#5568d3',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Key Benefits Section */}
            <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: '#1a202c'
                            }}
                        >
                            Why Join EduNexus?
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            sx={{ 
                                maxWidth: '500px', 
                                mx: 'auto', 
                                lineHeight: 1.8,
                                fontSize: '1rem',
                                fontWeight: 500
                            }}
                        >
                            Make informed decisions about your education and collaborate with the right people
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
                        {keyBenefits.map((benefit, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                                            borderColor: benefit.color,
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 2, color: benefit.color, display: 'flex', justifyContent: 'center' }}>
                                        {benefit.icon}
                                    </Box>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            mb: 2,
                                            color: '#1a202c',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {benefit.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="textSecondary" 
                                        sx={{ 
                                            flexGrow: 1,
                                            fontSize: '0.95rem',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {benefit.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Join Our Community Section - Statistics */}
            <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: '#1a202c'
                            }}
                        >
                            Join Our Community
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            sx={{ 
                                maxWidth: '500px', 
                                mx: 'auto', 
                                lineHeight: 1.8,
                                fontSize: '1rem',
                                fontWeight: 500
                            }}
                        >
                            Connect with students, instructors, and peers from around the world
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' } }}>
                        {/* Students Card */}
                        <Grid item xs={12} sm={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                                        borderColor: '#667eea',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: '#667eea' }}>
                                    <PersonIcon sx={{ fontSize: 48 }} />
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: '#1a202c'
                                    }}
                                >
                                    {loading ? '...' : stats.students}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="textSecondary" 
                                    sx={{ fontWeight: 500, fontSize: '0.95rem' }}
                                >
                                    Active Students
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Courses Card */}
                        <Grid item xs={12} sm={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                                        borderColor: '#667eea',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: '#667eea' }}>
                                    <BookIcon sx={{ fontSize: 48 }} />
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: '#1a202c'
                                    }}
                                >
                                    {loading ? '...' : stats.courses}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="textSecondary" 
                                    sx={{ fontWeight: 500, fontSize: '0.95rem' }}
                                >
                                    Available Courses
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Projects Card */}
                        <Grid item xs={12} sm={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                                        borderColor: '#667eea',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: '#667eea' }}>
                                    <FolderIcon sx={{ fontSize: 48 }} />
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: '#1a202c'
                                    }}
                                >
                                    {loading ? '...' : stats.projects}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="textSecondary" 
                                    sx={{ fontWeight: 500, fontSize: '0.95rem' }}
                                >
                                    Shared Projects
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Explore Platform Section - 3 columns in a row */}
            <Box sx={{ py: 8, backgroundColor: 'white', display: 'none' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: '#1a202c'
                            }}
                        >
                            Explore Our Platform
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            sx={{ 
                                maxWidth: '500px', 
                                mx: 'auto', 
                                lineHeight: 1.8,
                                fontSize: '1rem',
                                fontWeight: 500
                            }}
                        >
                            Everything you need to make better decisions about courses and collaboration
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' } }}>
                        {platformCards.map((card, idx) => (
                            <Grid item xs={12} sm={12} md={4} key={idx}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                            borderColor: card.color,
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 2, color: card.color }}>
                                        {card.icon}
                                    </Box>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            mb: 1,
                                            color: '#1a202c'
                                        }}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="textSecondary" 
                                        sx={{ 
                                            mb: 3, 
                                            flexGrow: 1,
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {card.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate(card.path)}
                                        sx={{
                                            background: card.gradient,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {card.buttonLabel}
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Final CTA Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 8,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 2
                        }}
                    >
                        Ready to Explore?
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            mb: 4,
                            opacity: 0.95,
                            fontWeight: 500,
                            fontSize: '1rem'
                        }}
                    >
                        Join thousands of students making smarter choices about learning and collaboration
                    </Typography>
                    {!isAuth ? (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="inherit"
                                size="large"
                                onClick={() => navigate('/users/signup')}
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#667eea',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6',
                                    }
                                }}
                            >
                                Create Free Account
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderColor: 'white',
                                    }
                                }}
                                size="large"
                                onClick={() => navigate('/users/signin')}
                            >
                                Sign In
                            </Button>
                        </Stack>
                    ) : (
                        <Button
                            variant="contained"
                            color="inherit"
                            size="large"
                            onClick={() => navigate('/course/list')}
                            sx={{
                                backgroundColor: 'white',
                                color: '#667eea',
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: '#f3f4f6',
                                }
                            }}
                        >
                            Start Exploring Now
                        </Button>
                    )}
                </Container>
            </Box>
        </Box>
    );
}

export default Home;