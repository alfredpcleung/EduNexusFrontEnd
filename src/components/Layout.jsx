import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Select,
    InputAdornment,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';

function Layout() {
    const { isAuth, user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchType, setSearchType] = useState('course');
    const [searchQuery, setSearchQuery] = useState('');

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignout = () => {
        logout();
        handleMenuClose();
        window.location.href = '/';
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        if (searchType === 'course') {
            navigate(`/course/list?search=${encodeURIComponent(searchQuery)}`);
        } else if (searchType === 'student') {
            navigate(`/users/list?search=${encodeURIComponent(searchQuery)}`);
        }
        setSearchQuery('');
    };

    return (
        <>
            <AppBar position="static" sx={{ mb: 0 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    {/* Logo/Title - Left */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ 
                            fontWeight: 'bold', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                            flexShrink: 0
                        }}
                    >
                        <BookIcon />
                        EduNexus
                    </Typography>

                    {/* Search Bar - Middle (Desktop Only) - Google-style design */}
                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            flexGrow: 1,
                            maxWidth: '500px',
                            mx: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)',
                            overflow: 'hidden',
                            '&:hover': {
                                boxShadow: '0 1px 6px rgba(32, 33, 36, 0.4)',
                            }
                        }}
                    >
                        <Select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            size="small"
                            sx={{
                                backgroundColor: 'transparent',
                                color: '#5f6368',
                                fontSize: '0.875rem',
                                minWidth: '150px',
                                height: '44px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    border: 'none'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    border: 'none'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#5f6368'
                                },
                                '& .MuiSelect-select': {
                                    paddingLeft: '16px',
                                    paddingRight: '8px !important'
                                }
                            }}
                        >
                            <MenuItem value="course">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BookIcon sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                                    <span>Courses</span>
                                </Box>
                            </MenuItem>
                            <MenuItem value="student">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PeopleIcon sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                                    <span>Teammates</span>
                                </Box>
                            </MenuItem>
                        </Select>

                        <Box sx={{ width: '1px', height: '24px', backgroundColor: '#dfe1e5' }} />

                        <TextField
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            sx={{
                                flex: 1,
                                minWidth: '200px',
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'transparent',
                                    height: '44px',
                                    color: '#202124',
                                    fontSize: '0.875rem',
                                    '& fieldset': {
                                        border: 'none'
                                    },
                                    '&:hover fieldset': {
                                        border: 'none'
                                    },
                                    '&.Mui-focused fieldset': {
                                        border: 'none'
                                    },
                                    '& input::placeholder': {
                                        color: '#9aa0a6',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: '#202124',
                                    padding: '10px 16px'
                                }
                            }}
                        />

                        <IconButton
                            type="submit"
                            sx={{
                                padding: '10px',
                                marginRight: '4px',
                                color: '#667eea',
                                '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)'
                                }
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    {/* Auth Buttons - Right (Desktop) */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center', flexShrink: 0 }}>
                        {!isAuth ? (
                            <>
                                <Button
                                    component={Link}
                                    to="/users/signin"
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<LoginIcon />}
                                    size="small"
                                    sx={{ textTransform: 'none', fontSize: '0.9rem' }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    component={Link}
                                    to="/users/signup"
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<BookIcon />}
                                    size="small"
                                    sx={{ textTransform: 'none', fontSize: '0.9rem' }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <Box>
                                <IconButton
                                    onClick={handleMenuOpen}
                                    color="inherit"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <AccountCircleIcon />
                                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                        Hi, {user?.displayName || 'User'}
                                    </Typography>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={() => navigate('/profile')}>
                                        <PersonIcon sx={{ mr: 1 }} /> Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/settings')}>
                                        <SettingsIcon sx={{ mr: 1 }} /> Settings
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/academic-record')}>
                                        <SchoolIcon sx={{ mr: 1 }} /> Your Academic Record
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/course-reviews')}>
                                        <RateReviewIcon sx={{ mr: 1 }} /> Your Course Reviews
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/group-projects')}>
                                        <GroupWorkIcon sx={{ mr: 1 }} /> Your Group Projects
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/teammate-reviews')}>
                                        <StarIcon sx={{ mr: 1 }} /> Your Teammate Reviews
                                    </MenuItem>
                                    <MenuItem onClick={handleSignout}>
                                        <LogoutIcon sx={{ mr: 1 }} /> Sign Out
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Box>

                    {/* Mobile Menu */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            onClick={handleMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {!isAuth ? (
                                <>
                                    <MenuItem component={Link} to="/users/signin" onClick={handleMenuClose}>
                                        <LoginIcon sx={{ mr: 1 }} /> Sign In
                                    </MenuItem>
                                    <MenuItem component={Link} to="/users/signup" onClick={handleMenuClose}>
                                        <BookIcon sx={{ mr: 1 }} /> Sign Up
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem disabled>
                                        <Typography variant="body2">Welcome, {user?.displayName || 'User'}</Typography>
                                    </MenuItem>
                                    <MenuItem disabled>
                                        <Typography variant="caption">Role: {user?.role || 'student'}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleSignout}>
                                        <LogoutIcon sx={{ mr: 1 }} /> Sign Out
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Layout;