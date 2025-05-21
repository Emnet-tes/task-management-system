import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Task, TaskInput } from "../../types/tasks";

/**
 * Get all tasks for a user (real-time listener)
 */
export const getTasks = (
  userId: string,
  callback: (tasks: Task[]) => void,
  errorCallback?: (error: Error) => void
) => {
  const tasksRef = collection(db, "users", userId, "tasks");
  const q = query(tasksRef);

  console.log(`[getTasks] Listening for tasks of user: ${userId}`);

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            dueDate: doc.data().dueDate,
            priority: doc.data().priority,
            status: doc.data().status,
            userId: doc.data().userId,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          } as Task)
      );
      console.log(`[getTasks] Fetched ${tasks.length} tasks`);
      callback(tasks);
    },
    (error) => {
      console.error(
        `[getTasks] Error listening for tasks of user: ${userId}`,
        error
      );
      if (errorCallback) errorCallback(error);
    }
  );
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (
  userId: string,
  taskId: string
): Promise<Task> => {
  try {
    const docRef = doc(db, "users", userId, "tasks", taskId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error(`[getTaskById] Task not found: ${taskId}`);
      throw new Error("Task not found");
    }

    const data = docSnap.data();
    console.log(`[getTaskById] Task loaded: ${taskId}`);

    return {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      userId: userId,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error(`[getTaskById] Failed to get task: ${taskId}`, error);
    throw error;
  }
};

/**
 * Create a new task under the current user
 */
export const createTask = async (
  taskInput: TaskInput,
  userId: string
): Promise<void> => {
  try {
    const tasksRef = collection(db, "users", userId, "tasks");

    await addDoc(tasksRef, {
      ...taskInput,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`[createTask] Task created for user ${userId}`);
  } catch (error) {
    console.log(`[createTask] Failed to create task for user ${userId}`, error);
    throw error;
  }
};

/**
 * Update a task by ID
 */
export const updateTask = async (
  userId: string,
  taskId: string,
  taskInput: TaskInput
): Promise<void> => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);

    await updateDoc(taskRef, {
      ...taskInput,
      updatedAt: serverTimestamp(),
    });

    console.log(`[updateTask] Task updated: ${taskId}`);
  } catch (error) {
    console.log(`[updateTask] Failed to update task: ${taskId}`, error);
    throw error;
  }
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (
  userId: string,
  taskId: string
): Promise<void> => {
  try {
    if (!userId || !taskId) {
      throw new Error(
        `[deleteTask] userId or taskId is undefined. userId: ${userId}, taskId: ${taskId}`
      );
    }
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
    console.log(`[deleteTask] Task deleted: ${taskId}`);
  } catch (error) {
    console.log(
      `[deleteTask] Failed to delete task: ${taskId}. userId: ${userId}, taskId: ${taskId}`,
      error
    );
    throw error;
  }
};
