import { Router, Request, Response } from "express";
import { getFlightByTourId } from "../db/database";

const router = Router();

router.get("/:tourId", async (req: Request, res: Response): Promise<void> => {
    const tourId = parseInt(req.params.tourId as string, 10);
    try {
        const flight = await getFlightByTourId(tourId);
        res.json(flight);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka s strežnikom" });
    }
});

export default router;