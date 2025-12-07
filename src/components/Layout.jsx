import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUsername, clearJWT } from './auth/auth-helper';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

function Layout() {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const isAuth = isAuthenticated();
    const username = getUsername();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignout = () => {
        clearJWT();
        handleMenuClose();
        window.location.href = '/';
    };

    return (
        <>
            <AppBar position="static" sx={{ mb: 3 }}>
                <Toolbar>
                    {/* Logo/Title */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <BookIcon />
                        EduNexus
                    </Typography>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                        {/* Home Link */}
                        <Button
                            component={Link}
                            to="/"
                            color="inherit"
                            startIcon={<HomeIcon />}
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Home
                        </Button>

                        {/* Courses Link */}
                        <Button
                            component={Link}
                            to="/course/list"
                            color="inherit"
                            startIcon={<BookIcon />}
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Courses
                        </Button>

                        {/* Auth Buttons */}
                        {!isAuth ? (
                            <>
                                <Button
                                    component={Link}
                                    to="/users/signin"
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<LoginIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    component={Link}
                                    to="/users/signup"
                                    variant="contained"
                                    color="secondary"
                                    sx={{ textTransform: 'none' }}
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
                                    <Typography variant="body2">{username}</Typography>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem disabled>
                                        <Typography variant="body2">Welcome, {username}</Typography>
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
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <HomeIcon sx={{ mr: 1 }} /> Home
                            </MenuItem>
                            <MenuItem component={Link} to="/course/list" onClick={handleMenuClose}>
                                <BookIcon sx={{ mr: 1 }} /> Courses
                            </MenuItem>
                            {!isAuth ? (
                                <>
                                    <MenuItem component={Link} to="/users/signin" onClick={handleMenuClose}>
                                        <LoginIcon sx={{ mr: 1 }} /> Sign In
                                    </MenuItem>
                                    <MenuItem component={Link} to="/users/signup" onClick={handleMenuClose}>
                                        Sign Up
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem onClick={handleSignout}>
                                    <LogoutIcon sx={{ mr: 1 }} /> Sign Out
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Layout;