import { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Link,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "./auth/auth-helper";

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
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        window.location.href = "/users/signin";
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
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome, {user?.displayName || "User"}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* My Courses Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Courses
              </Typography>
              {dashboardData.courses.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No courses yet
                </Typography>
              ) : (
                <Box>
                  {dashboardData.courses.map((course) => (
                    <Box key={course.id} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {user?.uid === course.owner ? (
                          <Link
                            href={`/course/edit/${course.id}`}
                            underline="hover"
                          >
                            {course.title}
                          </Link>
                        ) : (
                          course.title
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Projects Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Projects
              </Typography>
              {dashboardData.projects.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No projects yet
                </Typography>
              ) : (
                <Box>
                  {dashboardData.projects.map((project) => (
                    <Box key={project.id} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <Link
                          href={`/project/edit/${project.id}`}
                          underline="hover"
                        >
                          {project.title}
                        </Link>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Feedback Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Feedback
              </Typography>
              {dashboardData.feedback.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No feedback yet
                </Typography>
              ) : (
                <Box>
                  {dashboardData.feedback.map((fb) => (
                    <Box key={fb.id} sx={{ mb: 2, pb: 1, borderBottom: "1px solid #eee" }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {fb.project?.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Rating: {fb.rating}/5
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {fb.comment}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
