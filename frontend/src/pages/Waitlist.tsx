import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = "http://localhost:3001";

export default function SingleTour() {
    const { id } = useParams();
    const [tour, setTour] = useState<any>(null);

    useEffect(() => {
        async function loadTour() {
            try {
                const res = await fetch(`${API_URL}/tours/${id}`);
                const data = await res.json();
                setTour(data);
            } catch (err) {
                console.error("Napaka pri nalaganju ture:", err);
            }
        }
        loadTour();
    }, [id]);

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

    if (!tour) return <p>Nalaganje...</p>;

    return (
        <main>
            <h1>{tour.title}</h1>
            <p>{tour.description}</p>
            <p>Cena: {tour.price_per_person}€</p>
            <p>Odhod: {tour.departure_date}</p>
            <p>Vrnitev: {tour.return_date}</p>
            <p>Prosta mesta: {tour.available_seats}</p>
            <Link to={`/tours/${id}/reserve`}>Rezerviraj</Link>
            <button onClick={handleJoinWaitlist}>Pridruži se čakalni listi</button>
        </main>
    );
}