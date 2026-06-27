import { Router, Response, Request } from "express";
import { getAllPassengers } from "../db/database";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
    try {
        const passengers = await getAllPassengers();
        res.json(passengers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "ERROR: Nemorem do potnikov" });
    }
});

export default router;