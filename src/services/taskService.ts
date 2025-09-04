import { taskStore } from "../db/taskStore";
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
if (!payload.id) throw new Error("id is required (client-generated UUID)");
if (!payload.title) throw new Error("title is required");
const now = new Date().toISOString();
const task: Task = {
id: payload.id,
title: payload.title,
description: payload.description || "",
completed: Boolean(payload.completed),
updatedAt: payload.updatedAt && isIsoDate(payload.updatedAt) ? payload.updatedAt : now,
deleted: false,
clientId,
};
taskStore.upsert(task);
return task;
},


update(id: string, payload: Partial<Task>, clientId?: string): Task {
const existing = taskStore.get(id);
if (!existing) throw new Error("task not found");
const updatedAt = payload.updatedAt && isIsoDate(payload.updatedAt) ? payload.updatedAt : new Date().toISOString();
const updated: Task = {
...existing,
...("title" in payload ? { title: payload.title! } : {}),
...("description" in payload ? { description: payload.description } : {}),
...("completed" in payload ? { completed: Boolean(payload.completed) } : {}),
updatedAt,
clientId: clientId || existing.clientId,
};
taskStore.upsert(updated);
return updated;
},


softDelete(id: string, updatedAt?: string) {
const ts = updatedAt && isIsoDate(updatedAt) ? updatedAt : new Date().toISOString();
const existing = taskStore.get(id);
if (!existing) throw new Error("task not found");
taskStore.delete(id, ts);
return taskStore.get(id)!;
},
};
