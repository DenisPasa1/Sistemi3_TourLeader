import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "../db/database";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { first_name, last_name, email, phone, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        res.status(400).json({ error: "Ime, priimek, email in geslo so obvezni." });
        return;
    }

    try {
        const existing = await getUserByEmail(email);
        if (existing.length > 0) {
            res.status(409).json({ error: "Uporabnik s tem emailom ze obstaja." });
            return;
        }

        const password_hash = await bcrypt.hash(password, 12);
        const result = await createUser(first_name, last_name, email, phone || null, password_hash);

        (req.session as any).user = { id: result.insertId, email, role: "customer", first_name, last_name };

        res.status(201).json({ message: "Registracija uspesna!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka streznika." });
    }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email in geslo sta obvezna." });
        return;
    }

    try {
        const users = await getUserByEmail(email);

        if (users.length === 0) {
            res.status(401).json({ error: "Napacen email ali geslo." });
            return;
        }

        const user = users[0];
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            res.status(401).json({ error: "Napacen email ali geslo." });
            return;
        }

        (req.session as any).user = { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name };

        res.json({ message: "Prijava uspesna!", user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka streznika." });
    }
});

router.post("/logout", (req: Request, res: Response): void => {
    req.session.destroy(() => {
        res.json({ message: "Odjava uspesna." });
    });
});

router.get("/me", (req: Request, res: Response): void => {
    if (!(req.session as any).user) {
        res.status(401).json({ error: "Niste prijavljeni." });
        return;
    }
    res.json((req.session as any).user);
});

export default router;