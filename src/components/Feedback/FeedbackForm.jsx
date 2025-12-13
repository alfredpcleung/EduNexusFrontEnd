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
  Snackbar,
  Chip,
  Stack,
  FormControl,
  FormHelperText,
} from "@mui/material";
import * as feedbackService from "../../services/feedbackService";
import { PROJECT_LABELS, formatLabelsForSubmission } from "../../utils/feedbackLabels";

function FeedbackForm({ projectId, onFeedbackCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isDuplicate, setIsDuplicate] = useState(false);

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
      setIsDuplicate(false);

      const newFeedback = await feedbackService.create({
        projectId,
        rating: parseInt(rating),
        comment: comment.trim(),
        labels: formatLabelsForSubmission(selectedLabels)
      });

      setComment("");
      setRating(5);
      setSelectedLabels([]);
      setSuccessMsg("Feedback submitted successfully!");
      setOpenSnackbar(true);
      onFeedbackCreated(newFeedback);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      
      // Handle 409 Conflict - user already gave feedback
      if (err.status === 409 || err.message?.includes("409")) {
        setIsDuplicate(true);
        setError("You have already provided feedback for this project. You can edit your existing feedback or delete it to submit new feedback.");
      } else {
        setError(err.message || "Failed to submit feedback");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Leave Feedback
        </Typography>

        {error && (
          <Alert severity={isDuplicate ? "warning" : "error"} sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
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

          {/* Feedback Labels */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Labels (select up to 3)
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {PROJECT_LABELS.map(label => (
                  <Chip
                    key={label}
                    label={label}
                    onClick={() => {
                      const updated = selectedLabels.includes(label)
                        ? selectedLabels.filter(l => l !== label)
                        : selectedLabels.length < 3
                        ? [...selectedLabels, label]
                        : selectedLabels;
                      setSelectedLabels(updated);
                    }}
                    color={selectedLabels.includes(label) ? 'primary' : 'default'}
                    variant={selectedLabels.includes(label) ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Stack>
              <FormHelperText>
                {selectedLabels.length}/3 labels selected
              </FormHelperText>
            </FormControl>
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
    <Snackbar 
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={() => setOpenSnackbar(false)}
      message={successMsg}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  </Box>
  );
}

export default FeedbackForm;
