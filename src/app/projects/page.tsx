"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, Project } from "@/app/store/slices/projectSlice";
import { AppDispatch, RootState } from "@/app/store/store";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  // TypeScript will now infer the correct type from RootState
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>My Projects</h1>
      <ul>
        {projects.map((project: Project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
