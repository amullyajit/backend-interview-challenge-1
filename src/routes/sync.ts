import { Router } from "express";
import { syncService } from "../services/syncService";


export const syncRouter = Router();


// GET /sync?since=ISO_TIMESTAMP
syncRouter.get("/", (req, res) => {
const { since } = req.query as { since?: string };
const result = syncService.pull(since);
res.json(result);
});


// POST /sync (push operations)
syncRouter.post("/", (req, res) => {
const clientId = (req.body && req.body.clientId) || req.header("x-client-id");
if (!clientId) return res.status(400).json({ error: "clientId_required" });
const result = syncService.push({ clientId, operations: req.body.operations || [] });
res.json(result);
});
