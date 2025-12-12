import { remove } from "../../services/coursesService";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { TableRow, TableCell, Box, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListItemCourse = ({ course, onRemoved }) => {
    const { isAuth } = useAuth();

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            remove(id)
                .then(data => {
                    if (data && (data.success || data.deleted)) {
                        if (typeof onRemoved === 'function') onRemoved(id);
                    } else if (data && data.success === false) {
                        alert(data.message || 'Failed to delete course');
                    }
                })
                .catch(err => {
                    alert(err.message || 'Error deleting course');
                    console.log(err);
                });
        }
    };

    const courseId = course.id || course._id;

    return (
        <TableRow hover>
            <TableCell>{course.title || 'N/A'}</TableCell>
            <TableCell>{course.instructor || 'N/A'}</TableCell>
            <TableCell align="center">{course.credits || 0}</TableCell>
            <TableCell align="center">
                <span
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backgroundColor: course.status === 'active' ? '#c8e6c9' : '#ffccbc',
                        color: course.status === 'active' ? '#2e7d32' : '#d84315',
                    }}
                >
                    {course.status || 'unknown'}
                </span>
            </TableCell>
            <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {isAuth && (
                        <>
                            <IconButton
                                component={Link}
                                to={'/course/edit/' + courseId}
                                size="small"
                                color="primary"
                                title="Edit course"
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemove(courseId)}
                                title="Delete course"
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

export default ListItemCourse;