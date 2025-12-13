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
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  const [successMsg, setSuccessMsg] = useState("");
  const [projectOwner, setProjectOwner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuth) {
      navigate("/users/signin", { state: { from: `/project/edit/${id}` } });
      return;
    }

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuth, authLoading, navigate]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");
      setIsForbidden(false);
      const project = await projectsService.read(id);
      const ownerUid = project.owner || project.uid;
      setProjectOwner(ownerUid);

      setFormData({
        title: project.title || "",
        description: project.description || "",
        courseId: project.courseId || "",
        tags: project.tags ? project.tags.join(", ") : "",
        status: project.status || "draft",
      });

      // Check ownership
      if (user?.uid !== ownerUid) {
        setError("You don't have permission to perform this action.");
        setIsForbidden(true);
      }
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

    // Verify ownership before submission
    if (user?.uid !== projectOwner) {
      setSubmitError("You don't have permission to perform this action.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSuccessMsg("");

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
      setSuccessMsg('Project updated successfully!');
      setTimeout(() => navigate("/project/list"), 1500);
    } catch (err) {
      console.error("Error updating project:", err);
      if (err.message?.includes("403") || err.message?.includes("not authorized")) {
        setSubmitError("You don't have permission to perform this action.");
      } else {
        setSubmitError(err.message || "Failed to update project");
      }
    } finally {
      setIsSubmitting(false);
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

  if (error && user?.uid !== projectOwner) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/project/list")}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/project/list")}
          variant="text"
        >
          Back to Projects
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Edit Project</Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError('')}>
              {submitError}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg('')}>
              {successMsg}
            </Alert>
          )}

          {/* Always show form, but disable if forbidden */}
          <Box sx={{ opacity: isForbidden ? 0.6 : 1, pointerEvents: isForbidden ? 'none' : 'auto' }}>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Project"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => navigate("/project/list")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Box>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EditProject;
