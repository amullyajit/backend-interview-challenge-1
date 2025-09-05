import fs from "fs";
import path from "path";
import { Task } from "../types/task";

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(TASKS_FILE))
    fs.writeFileSync(TASKS_FILE, JSON.stringify({ tasks: [] }, null, 2));
}

export class TaskStore {
  private tasks: Map<string, Task> = new Map();

  constructor() {
    ensureDataDir();
    this.load();
  }

  private load() {
    try {
      const raw = fs.readFileSync(TASKS_FILE, "utf-8");
      const parsed = JSON.parse(raw) as { tasks: Task[] };
      parsed.tasks.forEach((t) => this.tasks.set(t.id, t));
    } catch {
      this.tasks = new Map();
    }
  }

  private persist() {
    const data = { tasks: Array.from(this.tasks.values()) };
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
  }

  list(includeDeleted = false): Task[] {
    return Array.from(this.tasks.values()).filter((t) => includeDeleted || !t.deleted);
  }

  get(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(task: Task): Task {
    this.tasks.set(task.id, task);
    this.persist();
    return task;
  }

  update(id: string, payload: Partial<Task>): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() };
    this.tasks.set(id, updated);
    this.persist();
    return updated;
  }

  softDelete(id: string): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const deletedTask = { ...existing, deleted: true, updatedAt: new Date().toISOString() };
    this.tasks.set(id, deletedTask);
    this.persist();
    return deletedTask;
  }
}

export const taskStore = new TaskStore();
