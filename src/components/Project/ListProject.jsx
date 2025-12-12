import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as projectsService from "../../services/projectsService";

function ListProject() {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectsService.list();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <h1>Projects</h1>
        {isAuth && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/project/add")}
          >
            Add Project
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {projects.length === 0 ? (
        <Alert severity="info">No projects found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={project.status || "N/A"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {isAuth && user?.uid === project.owner ? (
                      <Chip label="You" color="primary" size="small" />
                    ) : (
                      <span>{project.ownerName || "Unknown"}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ListProject;
