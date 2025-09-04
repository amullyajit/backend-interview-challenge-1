import express from "express";
import cors from "cors";
import morgan from "morgan";
import { tasksRouter } from "./routes/tasks";
import { syncRouter } from "./routes/sync";


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use("/tasks", tasksRouter);
app.use("/sync", syncRouter);


const PORT = Number(process.env.PORT || 3000);
if (process.env.NODE_ENV !== "test") {
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
}


export default app;
