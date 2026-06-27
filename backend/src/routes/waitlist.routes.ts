import { Router, Response, Request } from "express";
import { joinWaitlist, getWaitlistByTourId, getWaitlistByUserId } from "../db/database";
import { requireLogin, requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/", requireLogin, async (req: Request, res: Response): Promise<void> => {
    const { tour_id, user_id } = req.body;

    if (!user_id || !tour_id) {
        res.status(400).json({ error: "user_id in tour_id sta obvezna" });
        return;
    }
    try {
        const result = await joinWaitlist(user_id, tour_id);
        res.status(201).json({ message: "Dodani na čakalno listo!", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.get("/tour/:tourId", requireAdmin, async (req: Request, res: Response): Promise<void> => {
    const tourId = parseInt(req.params.tourId as string, 10);
    try {
        const waitlist = await getWaitlistByTourId(tourId);
        res.json(waitlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka s strežnikom" });
    }
});
router.get("/my", requireLogin, async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId as string, 10);
    try {
        const waitlist = await getWaitlistByUserId(userId);
        res.json(waitlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka s strežnikom" });
    }
});

export default router;