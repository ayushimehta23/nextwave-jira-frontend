import { useDrag } from "react-dnd";
import { useRef } from "react";

const TaskCard = ({ task }: { task: { id: number; title: string; status: string } }) => {
  const ref = useRef<HTMLDivElement>(null); // Create a ref for the div
  
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });

  drag(ref); // Attach the drag function to the ref

  return (
    <div
      ref={ref} // Use the ref here
      className={`card p-2 mb-2 ${isDragging ? "opacity-50" : ""}`}
      style={{ cursor: "grab" }}
    >
      {task.title}
    </div>
  );
};

export default TaskCard;
