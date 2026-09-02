import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001";

export default function AdminPanel() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<any[]>([]);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        if (!user || user.role !== "admin") { navigate("/login"); return; }
        fetch(`${API_URL}/reservations`)
            .then(res => res.json())
            .then(async (data) => {
                for (const r of data) {
                    const res = await fetch(`${API_URL}/reservations/${r.id}/passengers`);
                    r.passengers = await res.json();
                }
                setReservations(data);
            });
    }, []);

    return (
        <main>
            <h1>Admin Panel</h1>
            <h2>All Reservations</h2>
            {reservations.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                reservations.map((r: any) => (
                    <div key={r.id}>
                        <p>Reservation #{r.id}</p>
                        <p>User: {r.user_id}</p>
                        <p>Tour: {r.tour_id}</p>
                        <p>Status: {r.status}</p>
                        <p>Date: {r.reserved_at}</p>
                        {r.passengers?.map((p: any) => (
                            <p key={p.id}>— {p.first_name} {p.last_name}, potni list: {p.passport_number}</p>
                        ))}
                        <button onClick={async () => {
                            await fetch(`${API_URL}/reservations/${r.id}`, { method: "DELETE" });
                            setReservations(prev => prev.filter(x => x.id !== r.id));
                        }}>Zbriši</button>
                    </div>
                ))
            )}
        </main>
    );
}