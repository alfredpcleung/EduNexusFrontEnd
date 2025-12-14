import React from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { getApiUrl } from '../services/api';

function Home() {
    const navigate = useNavigate();
    const isAuth = isAuthenticated();

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (isAuth) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuth, navigate]);
    const [stats, setStats] = useState({
        registeredStudents: null,
        coursesWithReviews: null,
        activeStudents: null,
        projectsRecruiting: null,
    });
    const [loading, setLoading] = useState(true);
    // Search state - reserved for future navbar search integration
    const [searchType] = useState('course');
    const [searchQuery] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(getApiUrl('/stats/homepage'));
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        registeredStudents: data.registeredStudents ?? null,
                        coursesWithReviews: data.coursesWithReviews ?? null,
                        activeStudents: data.activeStudents ?? null,
                        projectsRecruiting: data.projectsRecruiting ?? null,
                    });
                } else {
                    console.error('Failed to fetch homepage stats');
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Reserved for future navbar search integration
    // (searchType and searchQuery state are currently unused)
    // Cleaned up for production

    const keyBenefits = [
        {
            icon: <VerifiedUserIcon sx={{ fontSize: 64 }} />,
            title: 'Choose the Right Teammates',
            description: 'See peer ratings and pick reliable collaborators.',
            color: '#667eea',
        },
        {
            icon: <StarIcon sx={{ fontSize: 64 }} />,
            title: 'Discover the Best Electives',
            description: 'Learn from feedback and maximize your GPA.',
            color: '#ec4899',
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 64 }} />,
            title: 'Get Insights on Core Courses',
            description: 'Know what to expect and how to succeed.',
            color: '#f59e0b',
        },
        {
            icon: <RateReviewIcon sx={{ fontSize: 64 }} />,
            title: 'Benefit from Peer Feedback',
            description: 'Make smarter academic choices with community reviews.',
            color: '#10b981',
        },
    ];

    const platformCards = [
        {
            icon: <BookIcon sx={{ fontSize: 64 }} />,
            title: 'Browse Courses',
            description: 'Explore courses with peer ratings and detailed feedback to help you choose wisely.',
            color: '#667eea',
            path: '/course/list',
            buttonLabel: 'View Courses',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            icon: <PersonIcon sx={{ fontSize: 64 }} />,
            title: 'Connect with Peers',
            description: 'Find teammates and colleagues based on verified credentials and peer reviews.',
            color: '#ec4899',
            path: '/users/list',
            buttonLabel: 'View Profiles',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
        },
        {
            icon: <FolderIcon sx={{ fontSize: 64 }} />,
            title: 'Showcase Projects',
            description: 'View student projects and showcase your own work with peer collaboration feedback.',
            color: '#f59e0b',
            path: '/project/list',
            buttonLabel: 'View Projects',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
    ];

    // Ensure consistent card sizes
    const cardStyle = {
        height: '100%',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    // Ensure consistent typography
    const typographyStyle = {
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: '1rem',
        fontWeight: 400,
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Hero Section with Background Image and Key Benefits */}
            <Box
                sx={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    py: { xs: 6, md: 8 },
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
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
                        zIndex: 1,
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.75rem' },
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Welcome to EduNexus
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 5,
                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                            fontWeight: 400,
                            opacity: 0.95,
                            maxWidth: '700px',
                            mx: 'auto'
                        }}
                    >
                        Make informed decisions about your education and collaborate with the right people
                    </Typography>

                    {/* Key Benefits Cards - Inside Hero */}
                    <Grid container spacing={3} sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        maxWidth: '1100px',
                        mx: 'auto'
                    }}>
                        {keyBenefits.map((benefit, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255, 255, 255, 0.65)',
                                        backdropFilter: 'blur(8px)',
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        minHeight: '240px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 2, color: benefit.color, display: 'flex', justifyContent: 'center' }}>
                                        {React.cloneElement(benefit.icon, { sx: { fontSize: 64 } })}
                                    </Box>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            mb: 1.5,
                                            color: '#1a202c',
                                            fontSize: '1.1rem',
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {benefit.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            flexGrow: 1,
                                            fontSize: '1rem',
                                            lineHeight: 1.5,
                                            color: '#374151'
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
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                color: '#1a202c'
                            }}
                        >
                            Join Our Community
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            sx={{ 
                                maxWidth: '600px', 
                                mx: 'auto', 
                                lineHeight: 1.6,
                                fontSize: { xs: '1.1rem', md: '1.2rem' },
                                fontWeight: 400
                            }}
                        >
                            Connect with students and peers from around the world
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, maxWidth: '1100px', mx: 'auto' }}>
                        {/* Registered Students Card */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    minHeight: '180px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: 'white' }}>
                                    <PersonIcon sx={{ fontSize: 56 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 0.5,
                                        color: 'white',
                                        fontSize: '2.25rem'
                                    }}
                                >
                                    {loading ? '...' : (stats.registeredStudents !== null ? stats.registeredStudents : '—')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ fontWeight: 500, fontSize: '1rem', opacity: 0.9 }}
                                >
                                    Registered Students
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Courses with Reviews Card */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    minHeight: '180px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(236, 72, 153, 0.3)',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: 'white' }}>
                                    <StarIcon sx={{ fontSize: 56 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 0.5,
                                        color: 'white',
                                        fontSize: '2.25rem'
                                    }}
                                >
                                    {loading ? '...' : (stats.coursesWithReviews !== null ? stats.coursesWithReviews : '—')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ fontWeight: 500, fontSize: '1rem', opacity: 0.9 }}
                                >
                                    Courses with Reviews
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Active Students Card */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    minHeight: '180px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: 'white' }}>
                                    <SchoolIcon sx={{ fontSize: 56 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 0.5,
                                        color: 'white',
                                        fontSize: '2.25rem'
                                    }}
                                >
                                    {loading ? '...' : (stats.activeStudents !== null ? stats.activeStudents : '—')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ fontWeight: 500, fontSize: '1rem', opacity: 0.9 }}
                                >
                                    Active Students
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Projects Recruiting Card */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    minHeight: '180px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(245, 158, 11, 0.3)',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: 'white' }}>
                                    <WorkIcon sx={{ fontSize: 56 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 0.5,
                                        color: 'white',
                                        fontSize: '2.25rem'
                                    }}
                                >
                                    {loading ? '...' : (stats.projectsRecruiting !== null ? stats.projectsRecruiting : '—')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ fontWeight: 500, fontSize: '1rem', opacity: 0.9 }}
                                >
                                    Projects Recruiting
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
                                        minHeight: '280px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                            borderColor: card.color,
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 2, color: card.color }}>
                                        {React.cloneElement(card.icon, { sx: { fontSize: 52 } })}
                                    </Box>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            ...typographyStyle, 
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
                                            ...typographyStyle, 
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