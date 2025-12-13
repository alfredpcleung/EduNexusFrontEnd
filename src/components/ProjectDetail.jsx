import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Button,
} from "@mui/material";
import * as projectsService from "../services/projectsService";
import * as feedbackService from "../services/feedbackService";
import FeedbackForm from "./Feedback/FeedbackForm";
import FeedbackList from "./Feedback/FeedbackList";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();

  const [project, setProject] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");
      const projectData = await projectsService.read(id);
      setProject(projectData);
      await fetchFeedback(id);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async (projectId) => {
    try {
      const feedback = await feedbackService.listByProject(projectId);
      setFeedbackList(feedback);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setFeedbackError(err.message || "Failed to load feedback");
    }
  };

  const handleFeedbackCreated = (newFeedback) => {
    setFeedbackList([...feedbackList, newFeedback]);
  };

  const handleFeedbackDeleted = (feedbackId) => {
    setFeedbackList(feedbackList.filter((fb) => (fb.id || fb._id) !== feedbackId));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/project/list")}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Project not found</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/project/list")}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "100%", display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 900 }}>
      {/* Feedback Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
          <FeedbackList 
            feedbackList={feedbackList}
            onFeedbackDeleted={handleFeedbackDeleted}
            feedbackError={feedbackError}
          />
        </Grid>

        {/* Feedback Form */}
        {isAuth && (
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 2, position: "sticky", top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  ✍️ Leave Feedback
                </Typography>
                <FeedbackForm projectId={id} onFeedbackCreated={handleFeedbackCreated} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {!isAuth && (
        <Card sx={{ mt: 4, backgroundColor: "#f5f5f5", boxShadow: 2 }}>
          <CardContent sx={{ py: 3, textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              📝 Want to share your feedback?
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Sign in to leave feedback and help others learn from this project.
            </Typography>
            <Button
              variant="contained"
              href="/users/signin"
              size="medium"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
      </Box>
    </Box>
  );
}

export default ProjectDetail;
