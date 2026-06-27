import { Router, Response, Request } from "express";
import { getBusByTourId, getBusSeatsByBusId } from "../db/database";

const router = Router();

router.get("/:tourId", async (req: Request, res: Response): Promise<void> => {
    const tourId = parseInt(req.params.tourId as string, 10);
    try {
        const bus = await getBusByTourId(tourId);
        res.json(bus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka s strežnikom" });
    }
});

router.get("/:busId/seats", async (req: Request, res: Response): Promise<void> => {
    const busId = parseInt(req.params.busId as string, 10);
    try {
        const seats = await getBusSeatsByBusId(busId);
        res.json(seats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka s strežnikom" });
    }
})
export default router;