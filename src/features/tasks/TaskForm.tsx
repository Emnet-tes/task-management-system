import { useEffect, useState } from "react";
import type { TaskInput } from "../../types/tasks";
import { useNavigate } from "react-router-dom";

interface TaskFormProps {
  onSubmit: (task: TaskInput) => Promise<void>;
  existingTask?: TaskInput | null;
  onCancel: () => void;
}

const TaskForm = ({ onSubmit, existingTask, onCancel }: TaskFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TaskInput>({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "To Do",
  });

  useEffect(() => {
    if (existingTask) {
      setFormData(existingTask);
    }
  }, [existingTask]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    navigate("/tasks");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder="Enter task title..."
          className="border border-gray-400  p-2 mt-1 block w-full rounded-md  shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="p-2 border border-gray-400  mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter task description..."
        />
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange}
          required
          className="p-2 mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2 ">
        <div className="w-full">
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="border border-gray-400 mt-1 block w-full rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Med">Medium</option>
            <option value="High">High</option>
            <option value="High">Urgent</option>
          </select>
        </div>

        <div className="w-full">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="p-2 border-gray-400 mt-1 block w-full rounded-md border  shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {existingTask ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
