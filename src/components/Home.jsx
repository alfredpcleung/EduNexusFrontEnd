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
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
            {/* Hero Section with Gradient Background - No bottom padding to remove gap */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: { xs: 6, md: 10 },
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
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
                            fontSize: { xs: '2rem', md: '3.5rem' },
                            letterSpacing: '-1px'
                        }}
                    >
                        Welcome to EduNexus
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 4,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            fontWeight: 300,
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
                            lineHeight: 1.8
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

            {/* Live Statistics Section */}
            <Box sx={{ py: 8 }}>
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 4,
                                color: '#1a202c'
                            }}
                        >
                            Join Our Community
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ maxWidth: '600px', mx: 'auto' }}>
                        {/* Students Card */}
                        <Grid item xs={12} sm={6}>
                            <Card
                                sx={{
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid #e5e7eb',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                                        transform: 'translateY(-4px)',
                                        borderColor: '#667eea'
                                    }
                                }}
                            >
                                <CardContent sx={{ py: 4 }}>
                                    <Box sx={{ mb: 2, color: '#667eea' }}>
                                        <PersonIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#667eea',
                                            mb: 1
                                        }}
                                    >
                                        {loading ? '...' : stats.students}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                        Students
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Courses Card */}
                        <Grid item xs={12} sm={6}>
                            <Card
                                sx={{
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid #e5e7eb',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                                        transform: 'translateY(-4px)',
                                        borderColor: '#667eea'
                                    }
                                }}
                            >
                                <CardContent sx={{ py: 4 }}>
                                    <Box sx={{ mb: 2, color: '#667eea' }}>
                                        <BookIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#667eea',
                                            mb: 1
                                        }}
                                    >
                                        {loading ? '...' : stats.courses}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                        Courses
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Projects Card */}
                        <Grid item xs={12} sm={6}>
                            <Card
                                sx={{
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid #e5e7eb',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                                        transform: 'translateY(-4px)',
                                        borderColor: '#667eea'
                                    }
                                }}
                            >
                                <CardContent sx={{ py: 4 }}>
                                    <Box sx={{ mb: 2, color: '#667eea' }}>
                                        <FolderIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#667eea',
                                            mb: 1
                                        }}
                                    >
                                        {loading ? '...' : stats.projects}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                        Projects
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Explore Platform Section - 3 columns in a row */}
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
                            Explore Our Platform
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            sx={{ maxWidth: '500px', mx: 'auto', lineHeight: 1.8 }}
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
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3, flexGrow: 1 }}>
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
                        variant="h6"
                        sx={{
                            mb: 4,
                            opacity: 0.95,
                            fontWeight: 300
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
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Start exploring courses, find teammates, and share your feedback today!
                        </Typography>
                    )}
                </Container>
            </Box>
        </Box>
    );
}

export default Home;