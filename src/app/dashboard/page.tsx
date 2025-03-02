"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProjects } from "../store/slices/projectSlice";
import { AppDispatch, RootState } from "../store/store";

export default function ProjectsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { projects, loading, error } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3">Projects</h1>
                <button className="btn btn-primary" onClick={() => router.push('/projects/create')}>
                    Create Project
                </button>
            </div>
            {loading && <div className="alert alert-info">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row gy-4"> {/* Added gy-4 for spacing between rows */}
                {projects.map((project) => (
                    <div key={project.id} className="col-md-4">
                        <div className="card shadow-sm h-100"> {/* Ensure all cards are same height */}
                            <div className="card-body d-flex flex-column"> {/* Flex column for alignment */}
                                <h5 className="card-title">{project.name}</h5>
                                <p className="card-text text-muted flex-grow-1">
                                    {project.description.length > 100 
                                        ? project.description.substring(0, 100) + "..." 
                                        : project.description}
                                </p>
                                <button 
                                    className="btn btn-outline-primary mt-auto" 
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
