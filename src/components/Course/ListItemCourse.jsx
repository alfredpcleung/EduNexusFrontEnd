import { useState } from "react";
import { remove } from "../../services/coursesService";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import useAuthorizationCheck from "../../hooks/useAuthorizationCheck";
import use403Handler from "../../hooks/use403Handler";
import { 
  TableRow, 
  TableCell, 
  Box, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Rating,
  Chip,
  Stack,
  Typography,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListItemCourse = ({ course, onRemoved }) => {
    const { user } = useAuth();
    const courseId = course.id || course._id;
    const courseOwner = course.owner || course.uid;
    const { canEdit, canDelete } = useAuthorizationCheck(courseOwner);
    const { error: authError, open: authErrorOpen, handleError: handleAuthError, clearError: clearAuthError } = use403Handler();
    
    // Admin can delete any course, owner can delete own course
    const canDeleteCourse = canDelete || user?.role === 'admin';
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Get rating data (fallback handling for missing backend fields)
    const averageRating = course.averageRating ?? null;
    const reviewCount = course.reviewCount ?? 0;
    const labels = course.labels || [];

    // Calculate top 3 labels sorted by count
    const topLabels = labels
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, 3);

    const handleDeleteClick = () => {
        setDeleteError("");
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDeleteError("");
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            setDeleteError("");
            
            const data = await remove(courseId);
            
            if (data && (data.success || data.deleted)) {
                if (typeof onRemoved === 'function') onRemoved(courseId);
                setDeleteDialogOpen(false);
            } else if (data?.message?.includes("not authorized") || data?.message?.includes("403")) {
                handleAuthError("You are not authorized to perform this action.");
            } else if (data?.success === false) {
                setDeleteError(data.message || 'Failed to delete course');
            }
        } catch (err) {
            console.error("Error deleting course:", err);
            if (err.status === 403 || err.message?.includes("403")) {
                handleAuthError("You are not authorized to perform this action.");
            } else {
                setDeleteError(err.message || 'Error deleting course');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <TableRow hover>
                <TableCell>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{course.title || 'N/A'}</Typography>
                        {/* Rating Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            {averageRating !== null ? (
                                <>
                                    <Rating value={averageRating} readOnly precision={0.5} size="small" />
                                    <Typography variant="caption" color="textSecondary">
                                        {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="caption" color="textSecondary">
                                    No reviews yet
                                </Typography>
                            )}
                        </Box>
                        {/* Top Labels */}
                        {topLabels.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                {topLabels.map((label, idx) => (
                                    <Chip
                                        key={idx}
                                        label={`${label.name || label} (${label.count || 0})`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 24 }}
                                    />
                                ))}
                            </Box>
                        )}
                        {topLabels.length === 0 && (
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                                No labels yet
                            </Typography>
                        )}
                    </Box>
                </TableCell>
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
                        {(canEdit || canDeleteCourse) && (
                            <>
                                <IconButton
                                    component={Link}
                                    to={'/course/edit/' + courseId}
                                    size="small"
                                    color="primary"
                                    title="Edit course"
                                    disabled={!canEdit}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={handleDeleteClick}
                                    title="Delete course"
                                    disabled={!canDeleteCourse}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}
                        {!canEdit && !canDeleteCourse && (
                            <Box sx={{ fontSize: '0.75rem', color: 'textSecondary', p: 1 }}>
                                Not owner
                            </Box>
                        )}
                    </Box>
                </TableCell>
            </TableRow>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    {deleteError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {deleteError}
                        </Alert>
                    )}
                    {!deleteError && (
                        <DialogContentText>
                            Are you sure you want to delete "{course.title}"? This action cannot be undone.
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={isDeleting}>
                        Cancel
                    </Button>
                    {!deleteError && (
                        <Button 
                            onClick={handleDeleteConfirm} 
                            color="error" 
                            variant="contained"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
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

export default ListItemCourse;