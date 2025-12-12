import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import * as projectsService from "../../services/projectsService";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    tags: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuth) {
      navigate("/users/signin", { state: { from: `/project/edit/${id}` } });
      return;
    }

    fetchProject();
  }, [id, isAuth, authLoading, navigate]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");
      const project = await projectsService.read(id);

      setFormData({
        title: project.title || "",
        description: project.description || "",
        courseId: project.courseId || "",
        tags: project.tags ? project.tags.join(", ") : "",
        status: project.status || "draft",
      });
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

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
      setSubmitError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        courseId: formData.courseId.trim() || undefined,
        status: formData.status,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : undefined,
      };

      await projectsService.update(id, projectData);
      navigate("/project/list");
    } catch (err) {
      console.error("Error updating project:", err);
      if (err.message && err.message.includes("403")) {
        setSubmitError("You don't have permission to edit this project.");
      } else {
        setSubmitError(err.message || "Failed to update project");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Card>
        <CardContent>
          <h2>Edit Project</h2>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
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

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Project"}
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
    </Box>
  );
}

export default EditProject;
