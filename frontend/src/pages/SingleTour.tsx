import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:3001";

export default function SingleTour() {
    const { id } = useParams();
    const [tour, setTour] = useState<any>(null);
    const [bus, setBus] = useState<any>(null);
    const [seats, setSeats] = useState<any[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [hotel, setHotel] = useState<any>(null);
    const [flight, setFlight] = useState<any>(null);

    const toggleSeat = (seatNum: number) => {
        setSelectedSeats(prev =>
            prev.includes(seatNum) ? prev.filter(s => s !== seatNum) : [...prev, seatNum]
        );
    };

    useEffect(() => {
        async function loadTour() {
            try {
                const res = await fetch(`${API_URL}/tours/${id}`);
                const data = await res.json();
                setTour(data);
                const busRes = await fetch(`${API_URL}/bus/${id}`);
                const busData = await busRes.json();
                if (busData[0]) {
                    setBus(busData[0]);
                    const seatsRes = await fetch(`${API_URL}/bus/${busData[0].id}/seats`);
                    const seatsData = await seatsRes.json();
                    setSeats(seatsData);
                }
                const hotelRes = await fetch(`${API_URL}/tours/${id}/hotel`);
                const hotelData = await hotelRes.json();
                if (hotelData[0]) setHotel(hotelData[0]);
                const flightRes = await fetch(`${API_URL}/flights/${id}`);
                const flightData = await flightRes.json();
                if (flightData[0]) setFlight(flightData[0]);
            } catch (err) {
                console.error("Napaka pri nalaganju ture:", err);
            }
        }
        loadTour();
    }, [id]);

    if (!tour) return <p>Nalaganje...</p>;

    const handleJoinWaitlist = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) { alert("Najprej se prijavite."); return; }
        const res = await fetch(`${API_URL}/waitlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tour_id: id, user_id: user.id }),
        });
        const data = await res.json();
        alert(data.message || data.error);
    };

    return (
        <main>
            <h1>{tour.title}</h1>
            <p>{tour.description}</p>
            <p>Cena: {tour.price_per_person} €</p>
            <p>Prosta mesta: {tour.available_seats}</p>
            {hotel && (
                <div>
                    <h3>Hotel</h3>
                    <p>{hotel.name} — {hotel.stars}★</p>
                    <p>Check-in: {hotel.check_in} | Check-out: {hotel.check_out}</p>
                </div>
            )}

            {flight && (
                <div>
                    <h3>Let</h3>
                    <p>{flight.airline} — {flight.flight_number}</p>
                    <p>{flight.departure_airport} → {flight.arrival_airport}</p>
                </div>
            )}
            {tour.available_seats === 0 ? (
                <button onClick={handleJoinWaitlist}>Pridruži se čakalni listi</button>
            ) : (
                <button onClick={() => {
                    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
                    localStorage.setItem("busId", String(bus.id));
                    window.location.href = `/tours/${id}/reserve`;
                }}>Rezerviraj</button>
            )}
            {bus && (
                <div>
                    <h3>Sedežni red</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", width: "fit-content" }}>
                        {Array.from({ length: bus.total_seats }, (_, i) => {
                            const seatNum = i + 1;
                            const occupied = seats.some(s => s.seat_number === seatNum);
                            return (
                                <button key={seatNum}
                                    disabled={occupied}
                                    onClick={() => toggleSeat(seatNum)}
                                    style={{
                                        background: occupied ? "red" : selectedSeats.includes(seatNum) ? "blue" : "green",
                                        color: "white",
                                        width: "40px",
                                        height: "40px",
                                        fontSize: "12px",
                                        cursor: occupied ? "not-allowed" : "pointer",
                                        border: "none",
                                        borderRadius: "4px"
                                    }}>
                                    {seatNum}
                                </button>
                            );
                        })}
                    </div>
                    {selectedSeats.length > 0 && (
                        <p>Izbrani sedeži: {selectedSeats.join(", ")}</p>
                    )}
                </div>
            )}
        </main>
    );
}