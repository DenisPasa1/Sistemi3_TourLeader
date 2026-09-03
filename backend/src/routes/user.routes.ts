import { Router, Request, Response } from "express";
import { updateUserProfile, updateUserPassword, pool } from "../db/database";
import bcrypt from "bcryptjs";

const router = Router();

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
    const { first_name, last_name, phone } = req.body;
    try {
        await updateUserProfile(Number(req.params.id), first_name, last_name, phone);
        res.json({ message: "Profil posodobljen" });
    } catch (err) {
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.put("/:id/password", async (req: Request, res: Response): Promise<void> => {
    const { current_password, new_password } = req.body;
    try {
        const [rows]: any = await pool.query("SELECT password_hash FROM user WHERE id = ?", [req.params.id]);
        const valid = await bcrypt.compare(current_password, rows[0].password_hash);
        if (!valid) {
            res.status(400).json({ error: "Trenutno geslo je napačno" });
            return;
        }
        const hash = await bcrypt.hash(new_password, 10);
        await updateUserPassword(Number(req.params.id), hash);
        res.json({ message: "Geslo posodobljeno" });
    } catch (err) {
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

export default router;