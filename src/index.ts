import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pool from "./db/database";
import session from "express-session";
import authRouter from "./routes/auth.routes";
import toursRouter from "./routes/tours.routes";
import reservationsRouter from "./routes/reservation.routes";
import busRouter from "./routes/bus.routes";
import destinationRouter from "./routes/destination.routes";
import flightRouter from "./routes/flight.routes";
import guideRouter from "./routes/guide.routes";
import passengerRouter from "./routes/passenger.routes";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET || "tour-leader-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", secure: false, maxAge: 1000 * 60 * 60 }
}));

app.get("/", (_req: Request, res: Response) => {
    res.send("API");
})

app.get("/health", async (_req: Request, res: Response) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "OK", database: "Connected" });
    } catch (err) {
        console.error("Error database", err);
        res.status(500).json({ status: "ERROR", database: "disconnected" });
    }
});
app.use("/auth", authRouter);
app.use("/tours", toursRouter);
app.use("/reservations", reservationsRouter);
app.use("/bus", busRouter);
app.use("/destinations", destinationRouter);
app.use("/flights", flightRouter);
app.use("/guides", guideRouter);
app.use("/passengers", passengerRouter);
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
});
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});