import React, { useEffect, useState, useRef } from 'react';
import { list } from '../../services/usersService.js';
import ListItemUser from './ListItemUser.jsx';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ListUser = () => {
    const location = useLocation();
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const searchTimeoutRef = useRef(null);

    const loadUsers = () => {
        list().then((data) => {
            if (data && Array.isArray(data)) {
                // Filter out admin users
                const filteredUsers = (data || []).filter(user => user.role !== 'admin');
                setUserList(filteredUsers);
            } else if (data && data.data) {
                // Filter out admin users
                const filteredUsers = (data.data || []).filter(user => user.role !== 'admin');
                setUserList(filteredUsers);
            }
            setIsLoading(false);
        }).catch(err => {
            setErrorMsg(err.message || 'Error loading users');
            console.log(err);
            setIsLoading(false);
        });
    };

    const loadUsersWithFilters = async (search = '', role = '') => {
        try {
            setIsLoading(true);
            setErrorMsg('');

            // Build query parameters
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (role) params.append('role', role);

            // Call backend with query params
            const data = await list(params.toString() || undefined);
            if (data && Array.isArray(data)) {
                // Filter out admin users
                const filteredUsers = (data || []).filter(user => user.role !== 'admin');
                setUserList(filteredUsers);
            } else if (data && data.data) {
                // Filter out admin users
                const filteredUsers = (data.data || []).filter(user => user.role !== 'admin');
                setUserList(filteredUsers);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Error loading users');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // When the component loads - check for URL search parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        
        if (searchParam) {
            setSearchTerm(searchParam);
            loadUsersWithFilters(searchParam, '');
        } else {
            loadUsers();
        }
    }, [location.search]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
            setIsLoading(true);
            loadUsersWithFilters(value, roleFilter);
        }, 500);
    };

    const handleRoleChange = (value) => {
        setRoleFilter(value);
        setIsLoading(true);
        loadUsersWithFilters(searchTerm, value);
    };

    // When a User is removed.
    const handleRemove = () => {
        loadUsersWithFilters(searchTerm, roleFilter);
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
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Users
                </Typography>
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
                        label="Search Users"
                        placeholder="Search by name or email..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={roleFilter}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Card>

            {/* Users Table */}
            {userList.length === 0 && !isLoading ? (
                <Alert severity="info">
                    {searchTerm || roleFilter ? 'No users match your filters.' : 'No users found'}
                </Alert>
            ) : (
                <Card>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Display Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Role</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Bio</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userList.map((user) => (
                                    <ListItemUser
                                        key={user.uid || user._id}
                                        user={user}
                                        onRemoved={loadUsers}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}
        </Container>
    );
};

export default ListUser;
