import { Router } from "express";
import { taskService } from "../services/taskService";


export const tasksRouter = Router();


// GET /tasks
tasksRouter.get("/", (_req, res) => {
res.json({ tasks: taskService.list() });
});


// GET /tasks/:id
tasksRouter.get("/:id", (req, res) => {
const task = taskService.get(req.params.id);
if (!task || task.deleted) return res.status(404).json({ error: "not_found" });
res.json(task);
});


// POST /tasks
// Client must generate UUID `id` and send ISO `updatedAt` (or server will set now)
tasksRouter.post("/", (req, res) => {
try {
const clientId = req.header("x-client-id") || undefined;
const created = taskService.create(req.body, clientId);
res.status(201).json(created);
} catch (e: any) {
res.status(400).json({ error: e?.message || "invalid_payload" });
}
});


// PATCH /tasks/:id
tasksRouter.patch("/:id", (req, res) => {
try {
const clientId = req.header("x-client-id") || undefined;
const updated = taskService.update(req.params.id, req.body, clientId);
res.json(updated);
} catch (e: any) {
if (String(e?.message).includes("not found")) return res.status(404).json({ error: "not_found" });
res.status(400).json({ error: e?.message || "invalid_payload" });
}
});


// DELETE /tasks/:id (soft delete)
tasksRouter.delete("/:id", (req, res) => {
try {
const now = new Date().toISOString();
const deleted = taskService.softDelete(req.params.id, req.query.updatedAt as string | undefined || now);
res.json(deleted);
} catch (e: any) {
if (String(e?.message).includes("not found")) return res.status(404).json({ error: "not_found" });
res.status(400).json({ error: e?.message || "invalid_request" });
}
});
