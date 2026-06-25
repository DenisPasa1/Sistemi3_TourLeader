import { Router, Request, Response } from "express";
import { getAllTours } from "../db/database";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const tours = await getAllTours();
        res.json(tours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "ERROR: Cant get tours" });

    }
});

export default router;