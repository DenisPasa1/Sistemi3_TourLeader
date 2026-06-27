import { Router, Request, Response } from 'express';
import { createReservation, getReservationsByUserId, createPassenger, getPassengerByReservationId } from '../db/database';
import { requireLogin } from '../middleware/auth';

const router = Router();

router.get('/:userId', requireLogin, async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId as string, 10);
    try {
        const reservations = await getReservationsByUserId(userId);
        res.json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Napaka strežnika' });
    }
});

router.post("/", requireLogin, async (req: Request, res: Response): Promise<void> => {
    const { tour_id, passengers } = req.body;
    const user_id = (req.session as any).user?.id;

    if (!user_id) {
        res.status(401).json({ error: "Niste prijavljeni" });
        return;
    }
    if (!tour_id || !passengers || passengers.length === 0) {
        res.status(400).json({ error: "tour_id in vsaj en potnik sta obvezna" });
        return;
    }
    try {
        const result = await createReservation("pending", user_id, tour_id);
        const reservationId = result.insertId;

        for (const p of passengers) {
            await createPassenger(p.first_name, p.last_name, p.date_of_birth, p.passport_number, p.passport_expiry, reservationId);
        }

        res.status(201).json({ message: "Rezervacija ustvarjena!", reservation_id: reservationId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.get("/:id/passengers", requireLogin, async (req: Request, res: Response): Promise<void> => {
    try {
        const passengers = await getPassengerByReservationId(Number(req.params.id));
        res.json(passengers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

export default router;