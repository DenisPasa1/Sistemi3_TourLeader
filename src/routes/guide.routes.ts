import { Router, Response, Request } from "express";
import { getAllGuides, getGuideById } from "../db/database";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const guides = await getAllGuides();
        res.json(guides);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "ERROR: Nemorem do vodičev" });
    }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const guide = await getGuideById(Number(req.params.id));
        if (guide.length === 0) {
            res.status(404).json({ error: "Guide not found" });
            return;
        }
        res.json(guide[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

export default router;