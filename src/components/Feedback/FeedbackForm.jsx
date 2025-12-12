import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import * as feedbackService from "../../services/feedbackService";

function FeedbackForm({ projectId, onFeedbackCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const newFeedback = await feedbackService.create({
        projectId,
        rating: parseInt(rating),
        comment: comment.trim(),
      });

      setComment("");
      setRating(5);
      setSuccess("Feedback submitted successfully!");
      onFeedbackCreated(newFeedback);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Leave Feedback
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Rating (1-5)"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              inputProps={{ min: 1, max: 5 }}
              fullWidth
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              required
              placeholder="Share your thoughts about this project..."
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default FeedbackForm;
