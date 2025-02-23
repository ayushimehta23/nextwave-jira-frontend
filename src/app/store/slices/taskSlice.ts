import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URL
const API_URL = "http://127.0.0.1:8000/api";

// Task Types
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  project: number;
  assigned_to: number;
}

interface TaskCreate {
  title: string;
  description: string;
  status: string;
  project: number;
  assigned_to: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Fetch tasks for a project
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/${projectId}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: TaskCreate, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/${taskData.project}/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error("Failed to create task");
      return await response.json(); // Backend returns full Task object with ID
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updateData }: { taskId: number; updateData: Partial<Task> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks/${taskId}/update-status/`, {  // ✅ Corrected URL
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update task");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);


// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete task");
      return taskId; // Returning deleted task ID
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Task Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
