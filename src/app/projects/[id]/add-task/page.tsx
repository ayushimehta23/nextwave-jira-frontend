"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { createTask } from "@/app/store/slices/taskSlice";
import { fetchProjectById } from "@/app/store/slices/projectSlice";

export default function AddTaskPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams(); // Get project ID from URL

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "to_do",
    assigned_to: "", // For assigning task
  });

  // Fetch project details to get assigned users
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(Number(id)));
    }
  }, [id, dispatch]);

  const { project } = useSelector((state: RootState) => state.projects);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      createTask({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        project: Number(id),
        assigned_to: Number(taskData.assigned_to),
      })
    );

    if (createTask.fulfilled.match(result)) {
      router.push(`/projects/${id}/board`); // Navigate to Kanban board after successful task creation
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" value={taskData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={taskData.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select name="status" className="form-control" value={taskData.status} onChange={handleChange}>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Assign To</label>
          <select name="assigned_to" className="form-control" value={taskData.assigned_to} onChange={handleChange} required>
            <option value="">Select a user</option>
            {project?.team_members?.map((member) => (
              <option key={member.id} value={member.id}>
                {member.username} ({member.email})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Task</button>
      </form>
    </div>
  );
}
