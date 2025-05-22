export type TaskPriority = "Low" | "Med" | "High" | "Urgent";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export type PriorityData = {
  [key: string]: number;
};

export const priorityColors: { [key: string]: string } = {
  Urgent: "bg-red-500",
  High: "bg-orange-500",
  Med: "bg-yellow-500",
  Low: "bg-blue-500",
};
