import { useEffect, useState } from "react";
import TaskForm from "../features/tasks/TaskForm";
import {
  getTaskById,
  createTask,
  updateTask,
} from "../features/tasks/taskService";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { TaskInput } from "../types/tasks";
import { toast } from "react-toastify";

type Props = {
  taskId?: string;
  onClose: () => void;
  onSuccess: () => void;
};

const TaskFormModal = ({ taskId, onClose, onSuccess }: Props) => {
  const [user, setUser] = useState(auth.currentUser);
  const [task, setTask] = useState<TaskInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        toast.error("You must be signed in.");
        return;
      }

      setUser(firebaseUser);

      if (taskId) {
        try {
          const taskData = await getTaskById(firebaseUser.uid, taskId);
          setTask(taskData);
        } catch (err) {
          console.error("Error fetching task:", err);
          toast.error("Failed to load task");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [taskId]);

  const handleSubmit = async (taskInput: TaskInput) => {
    if (!user) return;

    try {
      if (taskId) {
        await updateTask(user.uid, taskId, taskInput);
        toast.success("Task updated successfully");
      } else {
        await createTask(taskInput, user.uid);
        toast.success("Task created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save task");
      console.error("Error saving task:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {taskId ? "Edit Task" : "Create New Task"}
        </h2>
        <TaskForm
          onSubmit={handleSubmit}
          existingTask={task}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default TaskFormModal;
