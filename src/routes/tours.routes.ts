import { Router, Request, Response } from "express";
import { getAllTours, getTourById } from "../db/database";

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
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await getTourById(Number(req.params.id));
        if (tour.length === 0) {
            res.status(404).json({ error: "Tour not found" });
            return;
        }
        res.json(tour[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
})

export default router;