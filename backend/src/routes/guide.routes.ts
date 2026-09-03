import { Router, Response, Request } from "express";
import { getAllGuides, getGuideById, createGuideForUser, getGuideByUserId, updateGuideProfile, pool } from "../db/database";
import { createUser } from "../db/database";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const guides = await getAllGuides();
        res.json(guides);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
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

router.get("/user/:userId", async (req: Request, res: Response): Promise<void> => {
    try {
        const guide = await getGuideByUserId(Number(req.params.userId));
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

router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { first_name, last_name, bio, languages, photo, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        res.status(400).json({ error: "Ime, priimek, email in geslo so obvezni" });
        return;
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);
        const userResult = await createUser(first_name, last_name, email, null, password_hash);
        const userId = userResult.insertId;

        await pool.query("UPDATE user SET role = 'guide' WHERE id = ?", [userId]);
        const guideResult = await createGuideForUser(first_name, last_name, bio || "", languages || "", photo || "", userId);

        res.status(201).json({ message: "Vodnik ustvarjen!", id: guideResult.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
    const { bio, languages } = req.body;
    try {
        await updateGuideProfile(Number(req.params.id), bio, languages);
        res.json({ message: "Profil posodobljen" });
    } catch (err) {
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

export default router;