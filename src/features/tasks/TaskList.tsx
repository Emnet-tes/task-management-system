import TaskCard from "../../components/TaskCard";
import type { Task } from "../../types/tasks";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  console.log("Rendering TaskList with tasks:", tasks);

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Your Tasks ({tasks.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
