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

                    {/* Search Bar - Middle (Desktop Only) */}
                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                            flexGrow: 1,
                            maxWidth: '400px',
                            mx: 'auto'
                        }}
                    >
                        <Select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: '4px',
                                color: 'white',
                                fontSize: '0.9rem',
                                minWidth: '120px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.3)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.5)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'white'
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: 'white',
                                    '&::placeholder': {
                                        color: 'rgba(255,255,255,0.7)',
                                        opacity: 1
                                    }
                                }
                            }}
                        >
                            <MenuItem value="course">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BookIcon sx={{ fontSize: '1.2rem' }} />
                                    <span>Courses</span>
                                </Box>
                            </MenuItem>
                            <MenuItem value="student">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PeopleIcon sx={{ fontSize: '1.2rem' }} />
                                    <span>Teammates</span>
                                </Box>
                            </MenuItem>
                        </Select>

                        <TextField
                            placeholder={searchType === 'course' ? 'Search courses...' : 'Search students...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    '& fieldset': {
                                        borderColor: 'rgba(255,255,255,0.3)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255,255,255,0.5)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white'
                                    },
                                    '& input::placeholder': {
                                        color: 'rgba(255,255,255,0.7)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: 'white'
                                }
                            }}
                        />

                        <IconButton
                            type="submit"
                            color="inherit"
                            sx={{
                                padding: '8px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)'
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
                                        {user?.displayName || 'User'}
                                    </Typography>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem disabled>
                                        <Typography variant="body2">Welcome, {user?.displayName || 'User'}</Typography>
                                    </MenuItem>
                                    <MenuItem disabled>
                                        <Typography variant="caption">Role: {user?.role || 'student'}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleSignout}>
                                        <LogoutIcon sx={{ mr: 1 }} />
                                        Sign Out
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