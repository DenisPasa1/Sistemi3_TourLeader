import { Router, Request, Response } from 'express';
import { createReservation, getReservationsByUserId, createPassenger, getPassengerByReservationId, assignSeatsToReservation, updateAvailableSeats, pool } from '../db/database';

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query("SELECT r.*, t.title FROM reservation r JOIN tour t ON r.tour_id = t.id");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId as string, 10);
    try {
        const reservations = await getReservationsByUserId(userId);
        res.json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Napaka strežnika' });
    }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { tour_id, passengers, user_id, seat_numbers, bus_id } = req.body;

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

        if (seat_numbers && bus_id) {
            await assignSeatsToReservation(reservationId, seat_numbers, bus_id);
        }

        await updateAvailableSeats(tour_id, -passengers.length);

        res.status(201).json({ message: "Rezervacija ustvarjena!", reservation_id: reservationId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.get("/:id/passengers", async (req: Request, res: Response): Promise<void> => {
    try {
        const passengers = await getPassengerByReservationId(Number(req.params.id));
        res.json(passengers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.put("/:id/accept", async (req: Request, res: Response): Promise<void> => {
    try {
        await pool.query("UPDATE reservation SET status = 'accepted' WHERE id = ?", [req.params.id]);
        res.json({ message: "Rezervacija odobrena" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.put("/:id/cancel", async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query<any[]>("SELECT * FROM reservation WHERE id = ?", [req.params.id]);
        if (rows.length === 0) { res.status(404).json({ error: "Rezervacija ni najdena" }); return; }

        const reservation = rows[0];
        const [passengers] = await pool.query<any[]>("SELECT COUNT(*) as count FROM passenger WHERE reservation_id = ?", [req.params.id]);
        const passengerCount = passengers[0].count;

        await pool.query("DELETE FROM bus_seat WHERE reservation_id = ?", [req.params.id]);
        await pool.query("UPDATE reservation SET status = 'cancelled' WHERE id = ?", [req.params.id]);
        await updateAvailableSeats(reservation.tour_id, passengerCount);

        res.json({ message: "Rezervacija preklicana" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query<any[]>("SELECT * FROM reservation WHERE id = ?", [req.params.id]);
        if (rows.length === 0) { res.status(404).json({ error: "Rezervacija ni najdena" }); return; }

        const reservation = rows[0];
        const [passengers] = await pool.query<any[]>("SELECT COUNT(*) as count FROM passenger WHERE reservation_id = ?", [req.params.id]);
        const passengerCount = passengers[0].count;

        await pool.query("DELETE FROM passenger WHERE reservation_id = ?", [req.params.id]);
        await pool.query("DELETE FROM bus_seat WHERE reservation_id = ?", [req.params.id]);
        await pool.query("DELETE FROM reservation WHERE id = ?", [req.params.id]);
        await updateAvailableSeats(reservation.tour_id, passengerCount);

        res.json({ message: "Rezervacija zbrisana!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});

export default router;