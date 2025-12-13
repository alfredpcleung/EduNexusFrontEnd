import { useState } from "react";
import { remove } from "../../services/projectsService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
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
  Chip,
  Rating,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListItemProject = ({ project, onRemoved }) => {
    const { isAuth, user } = useAuth();
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const projectId = project.id || project._id;
    const projectOwner = project.owner || project.uid;
    const isOwner = isAuth && user?.uid === projectOwner;

    // Get rating data (fallback handling for missing backend fields)
    const averageRating = project.averageRating ?? null;
    const reviewCount = project.reviewCount ?? 0;
    const labels = project.labels || [];

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
            
            const data = await remove(projectId);
            
            if (data && (data.success || data.deleted)) {
                if (typeof onRemoved === 'function') onRemoved(projectId);
                setDeleteDialogOpen(false);
            } else if (data?.success === false) {
                // Check for 403 Forbidden (not owner)
                if (data.message?.includes("not authorized") || data.message?.includes("owner")) {
                    setDeleteError("You don't have permission to delete this project. Only the project owner can delete it.");
                } else {
                    setDeleteError(data.message || 'Failed to delete project');
                }
            }
        } catch (err) {
            console.error("Error deleting project:", err);
            setDeleteError(err.message || 'Error deleting project');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <TableRow hover>
                <TableCell>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{project.title || 'N/A'}</Typography>
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
                <TableCell>
                    <Chip
                        label={project.status || "N/A"}
                        size="small"
                        variant="outlined"
                    />
                </TableCell>
                <TableCell>
                    {isAuth && user?.uid === projectOwner ? (
                        <Chip label="You" color="primary" size="small" />
                    ) : (
                        <span>{project.ownerName || "Unknown"}</span>
                    )}
                </TableCell>
                <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/project/${projectId}`)}
                        >
                            View
                        </Button>
                        {isOwner && (
                            <>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => navigate(`/project/edit/${projectId}`)}
                                    title="Edit project"
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={handleDeleteClick}
                                    title="Delete project"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    </Box>
                    {!isOwner && isAuth && (
                        <Box sx={{ fontSize: '0.75rem', color: 'textSecondary', mt: 1 }}>
                            Not owner
                        </Box>
                    )}
                </TableCell>
            </TableRow>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogContent>
                    {deleteError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {deleteError}
                        </Alert>
                    )}
                    {!deleteError && (
                        <DialogContentText>
                            Are you sure you want to delete "{project.title}"? This action cannot be undone.
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
        </>
    );
};

export default ListItemProject;
