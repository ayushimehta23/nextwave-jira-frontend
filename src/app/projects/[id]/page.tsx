"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchProjectById } from "@/app/store/slices/projectSlice";

export default function ProjectDetailsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { id } = useParams(); // Get project ID from URL

    const { project, loading, error } = useSelector((state: RootState) => state.projects); // Use 'projects' slice

    useEffect(() => {
        if (id) {
          dispatch(fetchProjectById(Number(id))); 
        }
    }, [id, dispatch]);

    if (loading) return <div className="text-center mt-5">Loading project details...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white text-center">
                    <h4>{project?.name}</h4>
                </div>
                <div className="card-body">
                    <p><strong>Description:</strong> {project?.description}</p>
                    
                    <p><strong>Team Members:</strong></p>
                    <ul>
                        {project?.team_members?.map((member, index) =>
                            member.id ? (
                                <li key={member.id}>{member.username} ({member.email})</li>
                            ) : (
                                <li key={`fallback-${index}`}>Unknown Member</li>
                            )
                        )}
                    </ul>

                    <button 
    className="btn btn-success mt-3" 
    onClick={() => router.push(`/projects/${id}/add-task`)}
>
    + Add Task
</button>

                </div>
                <div className="card-footer text-center">
                    <button className="btn btn-secondary" onClick={() => router.push("/projects")}>
                        Back to Projects
                    </button>
                </div>
            </div>
        </div>
    );
}
