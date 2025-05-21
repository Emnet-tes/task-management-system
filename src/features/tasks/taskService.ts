// src/features/tasks/taskService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Task, TaskInput } from "../../types/tasks";

export const getTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          lastUpdated: doc.data().lastUpdated?.toDate(),
        } as Task)
    );
    callback(tasks);
  });
};

export const getTaskById = async (taskId: string): Promise<Task> => {
  const docRef = doc(db, "tasks", taskId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Task not found");
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    status: data.status,
    userId: data.userId,
    createdAt: data.createdAt?.toDate(),
    lastUpdated: data.lastUpdated?.toDate(),
  };
};

export const createTask = async (
  taskInput: TaskInput,
  userId: string
): Promise<void> => {
  await addDoc(collection(db, "tasks"), {
    ...taskInput,
    userId,
    createdAt: new Date(),
  });
};

export const updateTask = async (
  taskId: string,
  taskInput: TaskInput
): Promise<void> => {
  await updateDoc(doc(db, "tasks", taskId), {
    ...taskInput,
    lastUpdated: new Date(),
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, "tasks", taskId));
};
