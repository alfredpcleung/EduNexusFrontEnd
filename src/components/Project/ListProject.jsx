import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLocation } from "react-router-dom";
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as projectsService from "../../services/projectsService";
import ListItemProject from "./ListItemProject";

function ListProject() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const searchTimeoutRef = useRef(null);

  // Refetch whenever location changes (including navigating back to this page)
  useEffect(() => {
    fetchProjects();
  }, [location.pathname]);

  const fetchProjects = async (search = "", status = "") => {
    try {
      setLoading(true);
      setError("");
      
      // Build query parameters
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      
      // Call backend with query params (fallback to full list if not supported)
      const data = await projectsService.list(params.toString() || undefined);
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setLoading(true);
      fetchProjects(value, statusFilter);
    }, 500);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setLoading(true);
    fetchProjects(searchTerm, value);
  };

  const handleProjectRemoved = (projectId) => {
    setProjects(projects.filter(p => (p.id || p._id) !== projectId));
  };

  if (loading && projects.length === 0) {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
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

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
          <TextField
            label="Search Projects"
            placeholder="Search by title or tags..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Archived">Archived</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {projects.length === 0 ? (
        <Alert severity="info">
          {searchTerm || statusFilter ? "No projects match your filters." : "No projects found"}
        </Alert>
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
                <ListItemProject 
                  key={project.id || project._id} 
                  project={project}
                  onRemoved={handleProjectRemoved}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default ListProject;
