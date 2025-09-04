import fs from "fs";
import path from "path";
import { Task } from "../types/task";


const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");


function ensureDataDir() {
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, JSON.stringify({ tasks: [] }, null, 2));
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
} catch (e) {
// fresh store
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


upsert(task: Task) {
this.tasks.set(task.id, task);
this.persist();
}


delete(id: string, updatedAt: string) {
const existing = this.tasks.get(id);
if (!existing) return;
this.tasks.set(id, { ...existing, deleted: true, updatedAt });
this.persist();
}
}


export const taskStore = new TaskStore();
