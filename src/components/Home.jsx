import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './auth/auth-helper';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Stack,
    Chip,
    Paper,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Home() {
    const navigate = useNavigate();
    const isAuth = isAuthenticated();

    const features = [
        {
            icon: <BookIcon sx={{ fontSize: 48 }} />,
            title: 'Discover Courses',
            description: 'Explore thousands of courses and read peer reviews to guide your learning journey.',
            color: '#6366f1'
        },
        {
            icon: <GroupsIcon sx={{ fontSize: 48 }} />,
            title: 'Find Teammates',
            description: 'Connect with reliable peers based on verified collaboration history and feedback.',
            color: '#ec4899'
        },
        {
            icon: <RateReviewIcon sx={{ fontSize: 48 }} />,
            title: 'Share Feedback',
            description: 'Rate courses and colleagues to help others make informed decisions.',
            color: '#f59e0b'
        },
    ];

    const stats = [
        { number: '500+', label: 'Active Students' },
        { number: '200+', label: 'Courses' },
        { number: '1000+', label: 'Projects' },
    ];

    const platforms = [
        'React', 'Node.js', 'MongoDB', 'Express', 'Material-UI', 'REST APIs'
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Hero Section with Gradient Background */}
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

            {/* Stats Section */}
            <Box sx={{ py: 6, backgroundColor: '#f8f9fa' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ textAlign: 'center' }}>
                        {stats.map((stat, idx) => (
                            <Grid item xs={6} md={3} key={idx}>
                                <Box>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#667eea',
                                            mb: 1
                                        }}
                                    >
                                        {stat.number}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Core Features Section */}
            <Box sx={{ py: 8 }}>
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
                            Core Features
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            sx={{ maxWidth: '500px', mx: 'auto', lineHeight: 1.8 }}
                        >
                            Everything you need to make better decisions about courses and collaboration
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {features.map((feature, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        border: '1px solid #e5e7eb',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                            borderColor: feature.color,
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                backgroundColor: `${feature.color}15`,
                                                color: feature.color,
                                                mb: 3,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1.5,
                                                color: '#1a202c'
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ lineHeight: 1.7 }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Explore Section */}
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
                    </Box>

                    <Grid container spacing={3}>
                        {/* Courses */}
                        <Grid item xs={12} md={4}>
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
                                        borderColor: '#667eea',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: '#667eea' }}>
                                    <BookIcon sx={{ fontSize: 48 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Browse Courses
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, flexGrow: 1 }}>
                                    Explore courses with peer ratings and detailed feedback to help you choose wisely.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/course/list')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    View Courses
                                </Button>
                            </Paper>
                        </Grid>

                        {/* Users */}
                        <Grid item xs={12} md={4}>
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
                                        borderColor: '#ec4899',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: '#ec4899' }}>
                                    <PersonIcon sx={{ fontSize: 48 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Connect with Peers
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, flexGrow: 1 }}>
                                    Find teammates and colleagues based on verified credentials and peer reviews.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/users/list')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    View Profiles
                                </Button>
                            </Paper>
                        </Grid>

                        {/* Projects */}
                        <Grid item xs={12} md={4}>
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
                                        borderColor: '#f59e0b',
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2, color: '#f59e0b' }}>
                                    <FolderIcon sx={{ fontSize: 48 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Showcase Projects
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, flexGrow: 1 }}>
                                    View student projects and showcase your own work with peer collaboration feedback.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/project/list')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    View Projects
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Technology Stack Section */}
            <Box sx={{ py: 8 }}>
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
                            Built With Modern Technologies
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            sx={{ maxWidth: '500px', mx: 'auto' }}
                        >
                            Leveraging the best tools and frameworks for performance and reliability
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        {platforms.map((tech) => (
                            <Chip
                                key={tech}
                                label={tech}
                                sx={{
                                    py: 3,
                                    px: 2,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#667eea',
                                        color: 'white',
                                        borderColor: '#667eea',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            />
                        ))}
                    </Box>
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