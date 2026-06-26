import {Router, Request, Response} from 'express';
import {createReservation, getReservationsByUserId} from '../db/database';
const router = Router();

router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const reservations = await getReservationsByUserId(userId);
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    const {tour_id} = req.body;
    const user_id = (req.session as any).user?.id;

    if (!user_id) {
        res.status(401).json({error: "Niste prijavljeni"});
        return;
    }
    if(!tour_id){
        res.status(400).json({error: "Tour ID je obvezen"});
        return;
    }
    try {const result = await createReservation("pending", user_id, tour_id);
        res.status(201).json({ message: "Rezervacija je uspešna!", id: result.insertId});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Napaka strežnika"});
    }

});

export default router;