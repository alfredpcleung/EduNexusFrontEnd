import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Stack,
  FormControl,
  FormHelperText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as projectsService from "../../services/projectsService";
import { PROJECT_LABELS, formatLabelsForSubmission } from "../../utils/feedbackLabels";

function AddProject() {
  const { isAuth, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    tags: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuth) {
      navigate("/users/signin", { state: { from: "/project/add" } });
    }
  }, [isAuth, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        courseId: formData.courseId.trim() || undefined,
        status: formData.status,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : undefined,
        labels: formatLabelsForSubmission(selectedLabels)
      };

      await projectsService.create(projectData);
      setSuccessMsg("Project created successfully!");
      setOpenSnackbar(true);
      // Redirect after snackbar auto-dismisses
      setTimeout(() => navigate("/project/list"), 2000);
    } catch (err) {
      console.error("Error creating project:", err);
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Card>
        <CardContent>
          <h2>Create New Project</h2>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Project title"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Project description (optional)"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Course ID"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                fullWidth
                placeholder="Associated course ID (optional)"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                select
                SelectProps={{
                  native: true,
                }}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </TextField>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                fullWidth
                placeholder="Comma-separated tags (optional)"
              />
            </Box>

            {/* Project Labels */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Project Labels (select up to 3)
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

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => navigate("/project/list")}
              >
                Cancel
              </Button>
            </Box>
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

export default AddProject;
