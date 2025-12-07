import React, { useEffect, useState } from 'react';
import { list } from '../../services/usersService.js';
import ListItemUser from './ListItemUser.jsx';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ListUser = () => {
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const loadUsers = () => {
        list().then((data) => {
            if (data && Array.isArray(data)) {
                setUserList(data || []);
            } else if (data && data.data) {
                setUserList(data.data || []);
            }
            setIsLoading(false);
        }).catch(err => {
            setErrorMsg(err.message || 'Error loading users');
            console.log(err);
            setIsLoading(false);
        });
    };

    // When the component loads.
    useEffect(() => {
        loadUsers();
    }, []);

    // When a User is removed.
    const handleRemove = () => {
        loadUsers();
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

            {/* Users Table */}
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
                            {userList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            No users found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                userList.map((user) => (
                                    <ListItemUser
                                        key={user.uid || user._id}
                                        user={user}
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

export default ListUser;
