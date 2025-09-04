import { Task, SyncOperation, SyncPushPayload, SyncPushResult, SyncPullResult } from "../types/task";
import { taskService } from "./taskService";


/**
* Conflict strategy: last-write-wins using `updatedAt` timestamp.
* - If client op.updatedAt <= server.updatedAt -> conflict (return server copy)
* - Else apply client's change
*/
export const syncService = {
push(payload: SyncPushPayload): SyncPushResult {
const results = payload.operations.map((op) => {
const incoming = op.task;
const server = taskService.get(incoming.id);
const incomingTime = new Date(incoming.updatedAt).getTime();
const serverTime = server ? new Date(server.updatedAt).getTime() : -1;


if (server && incomingTime <= serverTime) {
return { id: incoming.id, status: "conflict" as const, reason: "stale_update", server };
}


try {
if (op.op === "create") {
const created = server ? taskService.update(incoming.id, incoming, payload.clientId) : taskService.create(incoming, payload.clientId);
return { id: created.id, status: "applied" as const };
}
if (op.op === "update") {
const updated = taskService.update(incoming.id, incoming, payload.clientId);
return { id: updated.id, status: "applied" as const };
}
if (op.op === "delete") {
taskService.softDelete(incoming.id, incoming.updatedAt);
return { id: incoming.id, status: "applied" as const };
}
return { id: incoming.id, status: "skipped" as const, reason: "unknown_op" };
} catch (e: any) {
return { id: incoming.id, status: "skipped" as const, reason: e?.message || "error" };
}
});


return { results, serverTime: new Date().toISOString() };
},


pull(since?: string): SyncPullResult {
const tasks = taskService.listSince(since);
return { tasks, serverTime: new Date().toISOString() };
},
};
