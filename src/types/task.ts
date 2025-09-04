export interface Task {
id: string; // client-generated UUID
title: string;
description?: string;
completed: boolean;
updatedAt: string; // ISO timestamp for last modification
deleted?: boolean; // soft delete flag used for sync
// optional metadata
clientId?: string; // which client created/last modified
}


export interface SyncOperation {
op: "create" | "update" | "delete";
task: Task; // for delete, send at least { id, updatedAt }
}


export interface SyncPushPayload {
clientId: string;
operations: SyncOperation[];
}


export interface SyncPushResultItem {
id: string;
status: "applied" | "conflict" | "skipped";
reason?: string;
server?: Task; // server state when conflict
}


export interface SyncPushResult {
results: SyncPushResultItem[];
serverTime: string;
}


export interface SyncPullResult {
tasks: Task[]; // all changes since `since`
serverTime: string;
}
