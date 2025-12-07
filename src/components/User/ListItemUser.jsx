import { TableRow, TableCell, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

// Note: Users service needs read and remove methods to be fully functional
const ListItemUser = ({ user, onRemoved }) => {
    const handleRemove = (uid) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            // Assuming there's a remove method in usersService
            // This can be uncommented when the service is ready
            // remove(uid)
            //     .then(data => {
            //         if (data && (data.success || data.deleted)) {
            //             if (typeof onRemoved === 'function') onRemoved(uid);
            //         }
            //     })
            //     .catch(err => {
            //         alert(err.message);
            //         console.log(err);
            //     });
        }
    };

    const userId = user.uid || user._id;

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
                    <IconButton
                        size="small"
                        color="primary"
                        title="Edit user"
                        disabled
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
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default ListItemUser;
