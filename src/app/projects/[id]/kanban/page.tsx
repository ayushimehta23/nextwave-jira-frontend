"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchProjectById } from "@/app/store/slices/projectSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateTask } from "@/app/store/slices/taskSlice";

// Define valid filter types
type TaskPriority = "all" | "high" | "medium" | "low";
type TaskStatus = "all" | "to_do" | "in_progress" | "done";

export default function KanbanBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>("all");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(Number(id)));
    }
  }, [id, dispatch]);

  const { project, loading } = useSelector((state: RootState) => state.projects);
  const tasks = project?.tasks || [];
  const teamMembers = project?.team_members || []; // Assuming team_members array is available in project data

  const columns = {
    to_do: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  // Priority mapping for sorting & colors
  const priorityMapping: Record<TaskPriority, { order: number; color: string; symbol: string }> = {
    high: { order: 1, color: "text-danger", symbol: "🔴" },
    medium: { order: 2, color: "text-warning", symbol: "🟠" },
    low: { order: 3, color: "text-success", symbol: "🟢" },
    all: { order: 4, color: "text-dark", symbol: "" },
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      dispatch(
        updateTask({
          taskId: Number(draggableId),
          updateData: { status: destination.droppableId },
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchProjectById(Number(id)));
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Project Kanban Board</h2>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-3 mb-3">
        {/* Search Filter */}
        <div>
          <label className="me-2"><strong>Search Tasks:</strong></label>
          <input
            type="text"
            className="form-control w-auto d-inline"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        {/* Priority Filter */}
        <div>
          <label className="me-2"><strong>Filter by Priority:</strong></label>
          <select
            className="form-select w-auto d-inline"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="me-2"><strong>Filter by Status:</strong></label>
          <select
            className="form-select w-auto d-inline"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
          >
            <option value="all">All Statuses</option>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="me-2"><strong>Filter by Assignee:</strong></label>
          <select
            className="form-select w-auto d-inline"
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
          >
            <option value="all">All Assignees</option>
            {teamMembers.map((member: { id: number; username: string }) => (
              <option key={member.id} value={member.username}>
                {member.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          {!loading &&
            Object.entries(columns).map(([status, title]) => (
              <div key={status} className="col-md-4">
                <h4 className="text-center">{title}</h4>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-3 border rounded bg-light min-vh-50"
                    >
                      {tasks
                        .filter(
                          (task) =>
                            (selectedStatus === "all" || task.status === selectedStatus) && // Status filter
                            (selectedPriority === "all" || task.priority === selectedPriority) && // Priority filter
                            (selectedAssignee === "all" || (task.assigned_to && task.assigned_to.username === selectedAssignee)) && // Assignee filter
                            (searchQuery === "" || task.title.toLowerCase().includes(searchQuery)) // Search filter
                        )
                        .filter((task) => task.status === status) // Ensure tasks appear in the correct column
                        .sort(
                          (a, b) =>
                            priorityMapping[a.priority as TaskPriority].order -
                            priorityMapping[b.priority as TaskPriority].order
                        ) // Sort tasks by priority
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="card mb-2 p-2 shadow-sm"
                              >
                                <h6 className={`card-title ${priorityMapping[task.priority as TaskPriority].color}`}>
                                  {priorityMapping[task.priority as TaskPriority].symbol} {task.title}
                                </h6>
                                <p className="card-text text-muted">{task.description}</p>
                                <p className="card-text">
                                  <strong>Assigned to: </strong>
                                  {task.assigned_to ? task.assigned_to.username : "Unassigned"}
                                </p>
                                {task.deadline && (
                                  <p className="card-text">
                                    <strong>Deadline: </strong> {new Date(task.deadline).toLocaleString()}
                                  </p>
                                )}
                               {task.comments.length > 0 && (
                                  <div className="mt-2 p-2 border rounded bg-secondary-subtle">
                                    <strong>Comments:</strong>
                                    {task.comments.map((comment) => (
                                      <div key={comment.id} className="border-bottom pb-1 mb-1">
                                        <small><strong>{comment.user}:</strong> {comment.text}</small>
                                        <br />
                                        <small className="text-muted">
                                          {new Date(comment.created_at).toLocaleString()}
                                        </small>
                                      </div>
                                    ))}
                                  </div>
                                )}
                           
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
        </div>
      </DragDropContext>
    </div>
  );
}
