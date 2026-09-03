import { Router, Response, Request } from "express";
import { getAllDestinations, getDestinationById, pool } from "../db/database";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const destinations = await getAllDestinations();
        res.json(destinations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "ERROR: Nemorem do destinacije" });
    }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const destination = await getDestinationById(Number(req.params.id));
        if (destination.length === 0) {
            res.status(404).json({ error: "Destination not found" });
            return;
        }
        res.json(destination[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});
router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { country, city, description } = req.body;
    if (!country || !city) {
        res.status(400).json({ error: "Država in mesto sta obvezna" });
        return;
    }
    try {
        const [result]: any = await pool.query(
            "INSERT INTO destination (country, city, description) VALUES (?, ?, ?)",
            [country, city, description || ""]
        );
        res.status(201).json({ message: "Destinacija dodana!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

export default router;