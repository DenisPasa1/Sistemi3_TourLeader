import { Router, Request, Response } from "express";
import { getAllTours, getTourById, getGuideByTourId, getHotelByTourId, pool } from "../db/database";
import { requireAdmin } from "../middleware/auth";
import { createTour, createBus, createFlight, createHotel } from "../db/database";
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
});
router.get("/:id/guide", async (req: Request, res: Response): Promise<void> => {
    try {
        const tourId = Number(req.params.id);
        const guide = await getGuideByTourId(tourId);
        res.json(guide);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});
router.get("/:id/hotel", async (req: Request, res: Response): Promise<void> => {
    try {
        const tourId = Number(req.params.id);
        const hotel = await getHotelByTourId(tourId);
        res.json(hotel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        await pool.query(`DELETE FROM passenger WHERE reservation_id IN (SELECT id FROM reservation WHERE tour_id = ?)`, [id]);
        await pool.query(`DELETE FROM bus_seat WHERE bus_id IN (SELECT id FROM bus WHERE tour_id = ?)`, [id]);
        await pool.query("DELETE FROM reservation WHERE tour_id = ?", [id]);
        await pool.query("DELETE FROM waitlist WHERE tour_id = ?", [id]);
        await pool.query("DELETE FROM bus WHERE tour_id = ?", [id]);
        await pool.query("DELETE FROM flight WHERE tour_id = ?", [id]);
        await pool.query("DELETE FROM hotel WHERE tour_id = ?", [id]);
        await pool.query("DELETE FROM tour WHERE id = ?", [id]);

        res.json({ message: "Tura izbrisana" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});
router.post("/", async (req: Request, res: Response): Promise<void> => {
    const {
        title, description, departure_date, return_date,
        price_per_person, max_seats, category, destination_id, guide_id,
        license_plate,
        hotel_name, hotel_address, stars, check_in, check_out,
        flights
    } = req.body;

    try {
        const tourResult = await createTour(title, description, departure_date, return_date,
            price_per_person, max_seats, category, destination_id, guide_id);
        const tourId = tourResult.insertId;

        await createBus(license_plate, max_seats, tourId);
        await createHotel(hotel_name, hotel_address, stars, check_in, check_out, tourId);

        if (flights && Array.isArray(flights)) {
            for (const f of flights) {
                await createFlight(f.flight_number, f.airline, f.departure_airport,
                    f.arrival_airport, f.departure_time, f.arrival_time, f.direction, tourId);
            }
        }

        res.status(201).json({ message: "Tura ustvarjena!", id: tourId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika" });
    }
});
export default router;