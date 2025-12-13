import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { useAuthorizationCheck } from "../../hooks/useAuthorizationCheck";
import { use403Handler } from "../../hooks/use403Handler";
import * as feedbackService from "../../services/feedbackService";

function FeedbackItem({ feedback, onFeedbackDeleted, onFeedbackEdit }) {
  const { user } = useAuth();
  const { canDelete } = useAuthorizationCheck(feedback.authorId);
  const { error, open, handleError, clearError } = use403Handler();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteFeedback = async () => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      setIsDeleting(true);
      await feedbackService.remove(feedback.id || feedback._id);
      onFeedbackDeleted(feedback.id || feedback._id);
    } catch (err) {
      console.error("Error deleting feedback:", err);
      if (err.status === 403 || err.message?.includes("403")) {
        handleError("403 Forbidden - You can only delete your own feedback");
      } else {
        handleError(err.message || "Failed to delete feedback");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#fafafa",
          borderLeft: "4px solid #1976d2",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: 1,
          },
        }}
        variant="outlined"
      >
        <CardContent sx={{ pb: 2, "&:last-child": { pb: 2 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
              gap: 1,
            }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Rating: {feedback.rating}/5
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                {feedback.author?.displayName || feedback.authorName || "Anonymous"}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 0.5 }}>
                {formatDate(feedback.createdAt)}
              </Typography>
            </Box>
            {user && canDelete && (
              <Button
                size="small"
                color="error"
                onClick={handleDeleteFeedback}
                disabled={isDeleting}
                sx={{ minWidth: "auto" }}
              >
                {isDeleting ? "⏳" : "🗑️"}
              </Button>
            )}
          </Box>
          <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
            {feedback.comment}
          </Typography>
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={clearError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={clearError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FeedbackItem;
