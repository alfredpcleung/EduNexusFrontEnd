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
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';

function Home() {
    const navigate = useNavigate();
    const isAuth = isAuthenticated();

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}
                >
                    Welcome to EduNexus
                </Typography>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
                    Your comprehensive learning management system
                </Typography>
            </Box>

            {/* Feature Cards */}
            <Grid container spacing={4} sx={{ mb: 8, justifyContent: 'center' }}>
                {/* Courses Card */}
                <Grid item xs={12} sm={12} md={3.5}>
                    <Card 
                        sx={{ 
                            height: 300, 
                            display: 'flex', 
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                            },
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <BookIcon sx={{ fontSize: 56, color: '#1976d2' }} />
                            </Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                                Browse Courses
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                                Explore a wide variety of courses designed to help you learn and grow.
                            </Typography>
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/course/list')}
                                sx={{ textTransform: 'none', fontWeight: 500 }}
                            >
                                View Courses
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Learn Card */}
                <Grid item xs={12} sm={12} md={3.5}>
                    <Card 
                        sx={{ 
                            height: 300, 
                            display: 'flex', 
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                            },
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <SchoolIcon sx={{ fontSize: 56, color: '#1976d2' }} />
                            </Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                                Learn
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                                Access high-quality educational content from expert instructors.
                            </Typography>
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/course/list')}
                                sx={{ textTransform: 'none', fontWeight: 500 }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Community Card */}
                <Grid item xs={12} sm={12} md={3.5}>
                    <Card 
                        sx={{ 
                            height: 300, 
                            display: 'flex', 
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                            },
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <PersonIcon sx={{ fontSize: 56, color: '#1976d2' }} />
                            </Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                                Join Community
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                                Connect with other learners and instructors in our community.
                            </Typography>
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={!isAuth}
                                onClick={() => navigate(isAuth ? '/course/list' : '/users/signin')}
                                sx={{ textTransform: 'none', fontWeight: 500 }}
                            >
                                {isAuth ? 'Join' : 'Sign In First'}
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Call to Action */}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
                {!isAuth ? (
                    <Stack spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Ready to start learning?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => navigate('/users/signin')}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                onClick={() => navigate('/users/signup')}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </Stack>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        Explore our courses and start your learning journey today!
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

export default Home;