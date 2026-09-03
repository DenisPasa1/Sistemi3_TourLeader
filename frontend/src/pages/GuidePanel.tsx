import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://88.200.63.148:3001";

export default function GuidePanel() {
    const navigate = useNavigate();
    const [guide, setGuide] = useState<any>(null);
    const [tours, setTours] = useState<any[]>([]);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        if (!user || user.role !== "guide") { navigate("/login"); return; }

        fetch(`${API_URL}/guides/user/${user.id}`)
            .then(r => r.json())
            .then(async (g) => {
                setGuide(g);
                const toursRes = await fetch(`${API_URL}/tours`);
                const allTours = await toursRes.json();
                const myTours = allTours.filter((t: any) => t.guide_id === g.id);

                for (const t of myTours) {
                    const resRes = await fetch(`${API_URL}/reservations`);
                    const allRes = await resRes.json();
                    const tourRes = allRes.filter((r: any) => r.tour_id === t.id);
                    t.reservations = tourRes;
                    for (const r of t.reservations) {
                        const pRes = await fetch(`${API_URL}/reservations/${r.id}/passengers`);
                        r.passengers = await pRes.json();
                    }
                }
                setTours(myTours);
            });
    }, []);

    return (
        <main>
            <h1>Guide Panel</h1>
            {guide && <p>Pozdravljeni, {guide.first_name} {guide.last_name}</p>}

            <h2>Moje ture</h2>
            {tours.length === 0 ? <p>Nimate dodeljenih tur.</p> : tours.map((t: any) => (
                <div key={t.id}>
                    <h3>{t.title}</h3>
                    <p>{t.departure_date} → {t.return_date}</p>
                    <p>Prostih mest: {t.available_seats} / {t.max_seats}</p>

                    <h4>Rezervacije</h4>
                    {t.reservations?.length === 0 ? <p>Ni rezervacij.</p> : t.reservations?.map((r: any) => (
                        <div key={r.id}>
                            <p>Rezervacija #{r.id} | Status: {r.status}</p>
                            {r.passengers?.map((p: any) => (
                                <p key={p.id}>— {p.first_name} {p.last_name}, potni list: {p.passport_number}</p>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </main>
    );
}