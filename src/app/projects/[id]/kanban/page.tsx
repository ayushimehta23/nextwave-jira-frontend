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

export default function KanbanBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(Number(id)));
    }
  }, [id, dispatch]);

  const { project, loading } = useSelector((state: RootState) => state.projects);
  console.log(project, "project")
  const tasks = project?.tasks || [];

  const columns = {
    to_do: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
  
    if (source.droppableId !== destination.droppableId) {
      dispatch(updateTask({
        taskId: Number(draggableId),
        updateData: { status: destination.droppableId },
      }))
      .unwrap() // Wait for the API call to complete
      .then(() => {
        dispatch(fetchProjectById(Number(id))); // Refetch project data
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
    }
  };
  

  // const handleDragEnd = (result: DropResult) => {
  //   if (!result.destination) return;
  //   const { source, destination, draggableId } = result;
  
  //   if (source.droppableId !== destination.droppableId) {
  //     dispatch(updateTask({
  //       taskId: Number(draggableId),
  //       updateData: { status: destination.droppableId }, // ✅ Fix: wrap status inside `updateData`
  //     }));
  //   }
  // };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Project Kanban Board</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          
          {!loading && Object.entries(columns).map(([status, title]) => (
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
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card mb-2 p-2 shadow-sm"
                            >
                              <h6 className="card-title">{task.title}</h6>
                              <p className="card-text text-muted">{task.description}</p>
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
