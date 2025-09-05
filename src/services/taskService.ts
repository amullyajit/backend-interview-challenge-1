import { taskStore } from "../db/taskStore";
import { Task } from "../types/task";
import { isIsoDate } from "../utils/dateUtils";

export const taskService = {
  list(): Task[] {
    return taskStore.list();
  },

  listSince(since?: string): Task[] {
    const sinceMs = since && isIsoDate(since) ? new Date(since).getTime() : 0;
    return taskStore
      .list(true)
      .filter((t) => new Date(t.updatedAt).getTime() > sinceMs);
  },

  get(id: string): Task | undefined {
    return taskStore.get(id);
  },

  create(payload: Partial<Task>, clientId?: string): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: clientId || crypto.randomUUID(),
      title: payload.title || "Untitled Task",
      description: payload.description || "",
      completed: payload.completed || false,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };
    return taskStore.create(newTask);
  },

  update(id: string, payload: Partial<Task>, clientId?: string): Task | undefined {
    return taskStore.update(id, { ...payload, updatedAt: new Date().toISOString() });
  },

  softDelete(id: string): Task | undefined {
    return taskStore.softDelete(id);
  },
};
