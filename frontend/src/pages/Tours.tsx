import { useEffect, useState } from "react";

const API_URL = "http://88.200.63.148:6767";

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
            <div className="tour-grid">
                {tours.map((tour: any) => (
                    <div key={tour.id}>
                        <h3><a href={`/tours/${tour.id}`}>{tour.title}</a></h3>
                        <p>Vodnik: {tour.guide_first_name} {tour.guide_last_name}</p>
                        <p>{tour.description}</p>
                        <p><strong>{tour.price_per_person} €</strong></p>
                    </div>
                ))}
            </div>
        </main>
    );
}