import { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Link,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "./auth/auth-helper";
import AddIcon from "@mui/icons-material/Add";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function Dashboard() {
  const { isAuth, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    courses: [],
    projects: [],
    feedback: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuth) {
      navigate("/users/signin", { state: { from: "/dashboard" } });
      return;
    }

    fetchDashboard();
  }, [isAuth, authLoading, navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authenticatedFetch(`${API_BASE_URL}/dashboard/me`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.status === 401) {
        // Token expired or invalid - auto-logout handled by authenticatedFetch
        navigate("/users/signin");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setDashboardData({
          courses: data.dashboard?.ownedCourses?.courses || [],
          projects: data.dashboard?.ownedProjects?.projects || [],
          feedback: data.dashboard?.authoredFeedback?.feedback || [],
        });
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.message || "An error occurred while loading dashboard");
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Welcome back, {user?.displayName || "User"}! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's an overview of your courses, projects, and feedback.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* My Courses Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                  📚 My Courses
                </Typography>
                <Chip
                  label={dashboardData.courses.length}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                You own {dashboardData.courses.length}{" "}
                {dashboardData.courses.length === 1 ? "course" : "courses"}
              </Typography>

              {dashboardData.courses.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No courses yet. Start creating your first course!
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {dashboardData.courses.map((course) => (
                    <Box
                      key={course.id || course._id}
                      sx={{
                        p: 1.5,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Link
                        href={`/course/edit/${course.id || course._id}`}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {course.title}
                        </Typography>
                      </Link>
                      <Typography variant="caption" color="textSecondary">
                        {course.credits} credits • {course.status}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate("/course/add")}
                variant="outlined"
              >
                Add Course
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* My Projects Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                  🚀 My Projects
                </Typography>
                <Chip
                  label={dashboardData.projects.length}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                You own {dashboardData.projects.length}{" "}
                {dashboardData.projects.length === 1 ? "project" : "projects"}
              </Typography>

              {dashboardData.projects.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No projects yet. Start building your portfolio!
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {dashboardData.projects.map((project) => (
                    <Box
                      key={project.id || project._id}
                      sx={{
                        p: 1.5,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Link
                        href={`/project/edit/${project.id || project._id}`}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {project.title}
                        </Typography>
                      </Link>
                      <Typography variant="caption" color="textSecondary">
                        {project.category}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate("/project/add")}
                variant="outlined"
              >
                Add Project
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* My Feedback Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                  💬 My Feedback
                </Typography>
                <Chip
                  label={dashboardData.feedback.length}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                You've left {dashboardData.feedback.length}{" "}
                {dashboardData.feedback.length === 1 ? "feedback" : "feedbacks"}
              </Typography>

              {dashboardData.feedback.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No feedback yet. Check out projects and share your thoughts!
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {dashboardData.feedback.map((fb) => (
                    <Box
                      key={fb.id || fb._id}
                      sx={{
                        p: 1.5,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {fb.project?.title || "Unknown Project"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                        <Chip
                          label={`⭐ ${fb.rating}/5`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fb.comment}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate("/project/list")}
                variant="outlined"
              >
                Browse Projects
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
