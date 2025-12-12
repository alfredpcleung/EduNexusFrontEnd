import { TableRow, TableCell, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { remove } from '../../services/usersService';

const ListItemUser = ({ user, onRemoved }) => {
    const { isAuth, user: currentUser } = useAuth();

    const handleRemove = (uid) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            remove(uid)
                .then(data => {
                    if (data && (data.success || data.deleted)) {
                        if (typeof onRemoved === 'function') onRemoved(uid);
                    } else if (data && data.success === false) {
                        alert(data.message || 'Failed to delete user');
                    }
                })
                .catch(err => {
                    alert(err.message || 'Error deleting user');
                    console.log(err);
                });
        }
    };

    const userId = user.uid || user._id;
    const isOwnProfile = currentUser && (currentUser.uid === userId || currentUser.email === user.email);

    return (
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
                    {isAuth && isOwnProfile && (
                        <>
                            <IconButton
                                component={Link}
                                to={`/users/edit/${userId}`}
                                size="small"
                                color="primary"
                                title="Edit user"
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemove(userId)}
                                title="Delete user"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </>
                    )}
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default ListItemUser;
