import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URL
const API_URL = "http://127.0.0.1:8000/api";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "to_do" | "in_progress" | "done"; // Ensure consistency
  project: number; // Project ID reference
  assigned_to: number | null; // User ID reference
  priority: string;
}

// Project Types
export interface Project {  // ✅ Add 'export' to allow importing it
  id: number;
  name: string;
  description: string;
  team_members: { id: number; username: string; email: string }[];
  tasks: Task[];  // Ensure tasks are correctly typed
}

interface ProjectState {
  projects: Project[];
  project: Project | null; // Store single project details
  loading: boolean;
  error: string | null;
}

// Fetch all projects
export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");

      return (await response.json()) as Project[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Fetch project by ID
export const fetchProjectById = createAsyncThunk<Project, number, { rejectValue: string }>(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch project details");

      return (await response.json()) as Project;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk<Project, { name: string; description?: string; team_members?: number[] }, { rejectValue: string }>(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error("Failed to create project");

      return (await response.json()) as Project;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk<number, number, { rejectValue: string }>(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/${projectId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete project");

      return projectId; // Return deleted project ID
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Initial state
const initialState: ProjectState = {
  projects: [],
  project: null, // Store single project details
  loading: false,
  error: null,
};

// Project Slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch projects";
      })

      // Fetch Project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch project details";
      })

      // Create a new project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload); // Add the new project to the list
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create project";
      })

      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete project";
      });
  },
});

export default projectSlice.reducer;
