"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { createProject } from "@/app/store/slices/projectSlice";
import { fetchUsers } from "@/app/store/slices/authSlice";

export default function CreateProjectPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Get users list from Redux store
    const { users, loading: usersLoading } = useSelector((state: RootState) => state.auth);
    const { user } = useSelector((state: RootState) => state.auth); // Logged-in user

    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
        team_members: [] as number[], // Array of selected user IDs
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);

    // Fetch users only when dropdown is clicked
    const handleDropdownClick = () => {
        if (!isDropdownClicked) {
            dispatch(fetchUsers());
            setIsDropdownClicked(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleTeamMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value));
        
        console.log(selectedOptions, "selectedOptions"); // ✅ Log selected values BEFORE updating state
    
        setProjectData((prevData) => {
            const updatedData = { ...prevData, team_members: selectedOptions };
            console.log(updatedData, "updated projectData"); // ✅ Log updated state correctly
            return updatedData;
        });
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectData.name.trim()) {
            setError("Project name is required");
            return;
        }
    
        setLoading(true);
        setError("");
    
        try {
            // Only send selected team members (excluding all fetched users)
            const selectedTeamMembers = projectData.team_members;
    
            // Ensure the creator is included but avoid duplicates
            const finalData = {
                ...projectData,
                team_members: user?.id
                    ? Array.from(new Set([...selectedTeamMembers, user.id])) // Unique IDs only
                    : selectedTeamMembers,
            };
    
            console.log("Submitting project data:", finalData); // Debugging log
    
            await dispatch(createProject(finalData)).unwrap();
            router.push("/projects");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create project");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white text-center">
                            <h4>Create New Project</h4>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Project Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={projectData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={projectData.description}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Team Members</label>
                                    <select
                                        className="form-control"
                                        multiple
                                        onClick={handleDropdownClick}
                                        onChange={handleTeamMemberChange}
                                        disabled={usersLoading}
                                    >
                                        {users.map((userItem) => (
                                            <option key={userItem.id} value={userItem.id}>
                                                {userItem.username} ({userItem.email})
                                            </option>
                                        ))}
                                    </select>
                                    <small className="text-muted">Hold Ctrl (Windows) or Command (Mac) to select multiple users.</small>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Create Project"}
                                </button>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <button
                                className="btn btn-link"
                                onClick={() => router.push("/projects")}
                            >
                                Back to Projects
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
