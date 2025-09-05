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
    return taskStore.create(payload, clientId);
  },

  update(id: string, payload: Partial<Task>, clientId?: string): Task {
    return taskStore.update(id, payload, clientId);
  },

  softDelete(id: string, updatedAt?: string): void {
    return taskStore.softDelete(id, updatedAt);
  }
};
