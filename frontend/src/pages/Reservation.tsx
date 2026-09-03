import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001";

export default function Reservation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const selectedSeats: number[] = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const busId = localStorage.getItem("busId");
    const [message, setMessage] = useState("");
    const [passengers, setPassengers] = useState<{
        seat_number: number | null;
        first_name: string;
        last_name: string;
        date_of_birth: string;
        passport_number: string;
        passport_expiry: string;
    }[]>(
        selectedSeats.length > 0
            ? selectedSeats.map((seat) => ({
                seat_number: seat,
                first_name: "", last_name: "", date_of_birth: "", passport_number: "", passport_expiry: ""
            }))
            : [{ seat_number: null, first_name: "", last_name: "", date_of_birth: "", passport_number: "", passport_expiry: "" }]
    );

    const handlePassengerChange = (index: number, field: string, value: string) => {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        setPassengers(updated);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) { setMessage("Najprej se prijavite."); return; }
        try {
            const res = await fetch(`${API_URL}/reservations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tour_id: id,
                    user_id: user.id,
                    passengers,
                    seat_numbers: selectedSeats,
                    bus_id: Number(busId)
                }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.removeItem("selectedSeats");
                localStorage.removeItem("busId");
                setMessage("Rezervacija uspešna!");
                navigate("/");
            } else setMessage(data.error || "Napaka.");
        } catch { setMessage("Napaka strežnika."); }
    };

    return (
        <main>
            <h1>Rezervacija</h1>
            <form onSubmit={handleSubmit}>
                {passengers.map((p, i) => (
                    <div key={i}>
                        {p.seat_number && <h3>Potnik za sedež #{p.seat_number}</h3>}
                        <input placeholder="Ime" value={p.first_name} onChange={(e) => handlePassengerChange(i, "first_name", e.target.value)} />
                        <input placeholder="Priimek" value={p.last_name} onChange={(e) => handlePassengerChange(i, "last_name", e.target.value)} />
                        <input type="date" value={p.date_of_birth} onChange={(e) => handlePassengerChange(i, "date_of_birth", e.target.value)} />
                        <input placeholder="Številka potnega lista" value={p.passport_number} onChange={(e) => handlePassengerChange(i, "passport_number", e.target.value)} />
                        <input type="date" value={p.passport_expiry} onChange={(e) => handlePassengerChange(i, "passport_expiry", e.target.value)} />
                    </div>
                ))}
                <button type="submit">Rezerviraj</button>
            </form>
            {message && <p>{message}</p>}
        </main>
    );
}