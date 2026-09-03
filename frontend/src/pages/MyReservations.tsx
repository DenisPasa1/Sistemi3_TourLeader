import { useEffect, useState } from "react";

const API_URL = "http://88.200.63.148:3001";

export default function MyReservations() {
    const [reservations, setReservations] = useState<any[]>([]);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        if (!user) return;
        fetch(`${API_URL}/reservations/${user.id}`)
            .then(res => res.json())
            .then(data => setReservations(data))
            .catch(err => console.error(err));
    }, []);

    if (!user) return <p>Najprej se prijavite.</p>;

    return (
        <main>
            <h1>Moje rezervacije</h1>
            {reservations.length === 0 ? (
                <p>Nimate še nobene rezervacije.</p>
            ) : (
                reservations.map((r: any) => (
                    <div key={r.id}>
                        <p>Rezervacija #{r.id}</p>
                        <p>Tura: {r.title || r.tour_id}</p>
                        <p>Status: {r.status}</p>
                        <p>Datum: {r.reserved_at}</p>
                    </div>
                ))
            )}
        </main>
    );
}