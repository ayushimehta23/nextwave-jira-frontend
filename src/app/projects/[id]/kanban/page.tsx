"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchProjectById } from "@/app/store/slices/projectSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateTask } from "@/app/store/slices/taskSlice";

// Define valid priority types
type TaskPriority = "high" | "medium" | "low";

export default function KanbanBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
// ✅ Explicitly ensure TypeScript knows tasks is Task[]


  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(Number(id)));
    }
  }, [id, dispatch]);

  const { project, loading } = useSelector((state: RootState) => state.projects);
  const tasks = project?.tasks || [];

  const columns = {
    to_do: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  // Priority mapping for sorting & colors
  const priorityMapping: Record<TaskPriority, { order: number; color: string; symbol: string }> = {
    high: { order: 2, color: "text-warning", symbol: "🟠" },
    medium: { order: 3, color: "text-primary", symbol: "🟡" },
    low: { order: 4, color: "text-success", symbol: "🟢" },
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
                        .filter((task) => task.status === status)
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
