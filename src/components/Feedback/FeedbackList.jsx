import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
} from "@mui/material";
import FeedbackItem from "./FeedbackItem";

function FeedbackList({ feedbackList, onFeedbackDeleted, feedbackError }) {
  return (
    <Card sx={{ boxShadow: 2, flex: 1 }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          💬 Feedback{" "}
          <Chip label={feedbackList.length} size="small" color="primary" />
        </Typography>

        {feedbackError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {feedbackError}
          </Alert>
        )}

        {feedbackList.length === 0 ? (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              No feedback yet. Be the first to share your thoughts!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {feedbackList.map((fb) => (
              <FeedbackItem
                key={fb.id || fb._id}
                feedback={fb}
                onFeedbackDeleted={onFeedbackDeleted}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default FeedbackList;
