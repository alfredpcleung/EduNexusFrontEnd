import { TableRow, TableCell, Box, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import useAuthorizationCheck from '../../hooks/useAuthorizationCheck';
import use403Handler from '../../hooks/use403Handler';
import { remove } from '../../services/usersService';
import { useState } from 'react';

const ListItemUser = ({ user, onRemoved }) => {
    const { isAuth, user: currentUser } = useAuth();
    const userId = user.uid || user._id;
    const { canEdit, canDelete } = useAuthorizationCheck(userId);
    const { error: authError, open: authErrorOpen, handleError: handleAuthError, clearError: clearAuthError } = use403Handler();
    const [deleting, setDeleting] = useState(false);

    // Admin can delete any user, owner can delete own profile
    const canDeleteUser = canDelete || currentUser?.role === 'admin';

    const handleRemove = (uid) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setDeleting(true);
            remove(uid)
                .then(data => {
                    setDeleting(false);
                    if (data && (data.success || data.deleted)) {
                        if (typeof onRemoved === 'function') onRemoved(uid);
                    } else if (data?.message?.includes("not authorized") || data?.message?.includes("403")) {
                        handleAuthError("You are not authorized to perform this action.");
                    } else if (data && data.success === false) {
                        alert(data.message || 'Failed to delete user');
                    }
                })
                .catch(err => {
                    setDeleting(false);
                    if (err.status === 403 || err.message?.includes("403")) {
                        handleAuthError("You are not authorized to perform this action.");
                    } else {
                        alert(err.message || 'Error deleting user');
                    }
                    console.log(err);
                });
        }
    };

    return (
        <>
            <TableRow hover>
                <TableCell>{user.displayName || 'N/A'}</TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell align="center">
                    <span
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            backgroundColor: user.role === 'instructor' ? '#c8e6c9' : '#e3f2fd',
                            color: user.role === 'instructor' ? '#2e7d32' : '#1565c0',
                        }}
                    >
                        {user.role || 'student'}
                    </span>
                </TableCell>
                <TableCell>{user.bio || 'N/A'}</TableCell>
                <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {(canEdit || canDeleteUser) && (
                            <>
                                <IconButton
                                    component={Link}
                                    to={`/users/edit/${userId}`}
                                    size="small"
                                    color="primary"
                                    title="Edit user"
                                    disabled={!canEdit}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemove(userId)}
                                    title="Delete user"
                                    disabled={!canDeleteUser || deleting}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    </Box>
                </TableCell>
            </TableRow>
            <Snackbar
                open={authErrorOpen}
                autoHideDuration={6000}
                onClose={clearAuthError}
                message={authError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </>
    );
};

export default ListItemUser;
