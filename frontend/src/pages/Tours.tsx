import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://88.200.63.148:3001";

export default function Tours() {
    const [tours, setTours] = useState([]);

    useEffect(() => {
        async function loadTours() {
            try {
                const res = await fetch(`${API_URL}/tours`);
                const data = await res.json();
                setTours(data);
            } catch (err) {
                console.error("Napaka pri nalaganju tur:", err);
            }
        }
        loadTours();
    }, []);

    return (
        <main>
            <h1>Seznam tur</h1>
            <ul>
                {tours.map((tour: any) => (
                    <div key={tour.id}>
                        <h2><Link to={`/tours/${tour.id}`}>{tour.title}</Link></h2>
                        <p>Vodnik: {tour.guide_first_name} {tour.guide_last_name}</p>
                        <p>{tour.description}</p>
                        <p>Cena: {tour.price_per_person} €</p>
                    </div>
                ))}
            </ul>
        </main>
    );
}