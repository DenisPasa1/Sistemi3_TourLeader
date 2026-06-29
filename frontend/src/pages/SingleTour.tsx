import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

    if (!tour) return <p>Nalaganje...</p>;

    return (
        <main>
            <h1>{tour.title}</h1>
            <p>{tour.description}</p>
            <p>Cena: {tour.price_per_person} €</p>
        </main>
    );
}