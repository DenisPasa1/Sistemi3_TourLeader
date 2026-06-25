import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pool from "./db/database";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req: Request, res: Response) => {
    res.send("API");
})

app.get("/health", async (_req: Request, res: Response) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "OK", database: "Connected" });
    } catch (err) {
        console.error("Error database", err);
        res.status(500).json({ status: "ERROR", database: "disconnected" });
    }
});
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});