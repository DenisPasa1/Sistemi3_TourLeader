import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001";

const emptyFlight = () => ({
    flight_number: "", airline: "", departure_airport: "",
    arrival_airport: "", departure_time: "", arrival_time: "", direction: "outbound"
});

export default function AdminPanel() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<any[]>([]);
    const [tours, setTours] = useState<any[]>([]);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [guides, setGuides] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [guideMessage, setGuideMessage] = useState("");
    const [guideForm, setGuideForm] = useState({
        first_name: "", last_name: "", bio: "", languages: "", photo: "", email: "", password: ""
    });

    const [form, setForm] = useState({
        title: "", description: "", departure_date: "", return_date: "",
        price_per_person: "", max_seats: "", category: "",
        destination_id: "", guide_id: "",
        license_plate: "",
        hotel_name: "", hotel_address: "", stars: "", check_in: "", check_out: "",
    });

    const [flights, setFlights] = useState([emptyFlight(), { ...emptyFlight(), direction: "return" }]);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        if (!user || user.role !== "admin") { navigate("/login"); return; }

        fetch(`${API_URL}/reservations`).then(r => r.json()).then(async (data) => {
            for (const r of data) {
                const res = await fetch(`${API_URL}/reservations/${r.id}/passengers`);
                r.passengers = await res.json();
            }
            setReservations(data);
        });

        fetch(`${API_URL}/tours`).then(r => r.json()).then(setTours);
        fetch(`${API_URL}/destinations`).then(r => r.json()).then(setDestinations);
        fetch(`${API_URL}/guides`).then(r => r.json()).then(setGuides);
    }, []);

    const setFlight = (i: number, field: string, value: string) => {
        setFlights(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            ...form,
            price_per_person: parseFloat(form.price_per_person),
            max_seats: parseInt(form.max_seats),
            destination_id: parseInt(form.destination_id),
            guide_id: parseInt(form.guide_id),
            stars: parseInt(form.stars),
            flights,
        };

        const res = await fetch(`${API_URL}/tours`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setMessage("Tura uspešno ustvarjena!");
            setForm({
                title: "", description: "", departure_date: "", return_date: "",
                price_per_person: "", max_seats: "", category: "",
                destination_id: "", guide_id: "", license_plate: "",
                hotel_name: "", hotel_address: "", stars: "", check_in: "", check_out: "",
            });
            setFlights([emptyFlight(), { ...emptyFlight(), direction: "return" }]);
            fetch(`${API_URL}/tours`).then(r => r.json()).then(setTours);
        } else {
            const err = await res.json();
            setMessage("Napaka: " + err.error);
        }
    };

    const handleCreateGuide = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/guides`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(guideForm),
        });
        if (res.ok) {
            setGuideMessage("Vodnik ustvarjen!");
            setGuideForm({ first_name: "", last_name: "", bio: "", languages: "", photo: "", email: "", password: "" });
            fetch(`${API_URL}/guides`).then(r => r.json()).then(setGuides);
        } else {
            const err = await res.json();
            setGuideMessage("Napaka: " + err.error);
        }
    };

    const deleteTour = async (id: number) => {
        await fetch(`${API_URL}/tours/${id}`, { method: "DELETE" });
        setTours(prev => prev.filter(t => t.id !== id));
    };

    const f = form;
    const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    return (
        <main>
            <h1>Admin Panel</h1>

            <h2>Ustvari vodnika</h2>
            <form onSubmit={handleCreateGuide}>
                <input placeholder="Ime" value={guideForm.first_name} onChange={e => setGuideForm({ ...guideForm, first_name: e.target.value })} required /><br />
                <input placeholder="Priimek" value={guideForm.last_name} onChange={e => setGuideForm({ ...guideForm, last_name: e.target.value })} required /><br />
                <input placeholder="Email" value={guideForm.email} onChange={e => setGuideForm({ ...guideForm, email: e.target.value })} required /><br />
                <input type="password" placeholder="Geslo" value={guideForm.password} onChange={e => setGuideForm({ ...guideForm, password: e.target.value })} required /><br />
                <textarea placeholder="Bio" value={guideForm.bio} onChange={e => setGuideForm({ ...guideForm, bio: e.target.value })} /><br />
                <input placeholder="Jeziki (npr. SL, EN, DE)" value={guideForm.languages} onChange={e => setGuideForm({ ...guideForm, languages: e.target.value })} /><br />
                <input placeholder="URL fotografije" value={guideForm.photo} onChange={e => setGuideForm({ ...guideForm, photo: e.target.value })} /><br />
                <button type="submit">Ustvari vodnika</button>
            </form>
            {guideMessage && <p>{guideMessage}</p>}

            <h2>Ustvari novo turo</h2>
            <form onSubmit={handleCreate}>
                <h3>Tura</h3>
                <input placeholder="Naslov" value={f.title} onChange={e => set("title", e.target.value)} required /><br />
                <textarea placeholder="Opis" value={f.description} onChange={e => set("description", e.target.value)} /><br />
                <label>Odhod: <input type="date" value={f.departure_date} onChange={e => set("departure_date", e.target.value)} required /></label><br />
                <label>Povratek: <input type="date" value={f.return_date} onChange={e => set("return_date", e.target.value)} required /></label><br />
                <input type="number" placeholder="Cena na osebo" value={f.price_per_person} onChange={e => set("price_per_person", e.target.value)} required /><br />
                <input type="number" placeholder="Maks. sedežev" value={f.max_seats} onChange={e => set("max_seats", e.target.value)} required /><br />
                <input placeholder="Kategorija" value={f.category} onChange={e => set("category", e.target.value)} /><br />
                <select value={f.destination_id} onChange={e => set("destination_id", e.target.value)} required>
                    <option value="">-- Destinacija --</option>
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.city}, {d.country}</option>)}
                </select><br />
                <select value={f.guide_id} onChange={e => set("guide_id", e.target.value)} required>
                    <option value="">-- Vodnik --</option>
                    {guides.map(g => <option key={g.id} value={g.id}>{g.first_name} {g.last_name}</option>)}
                </select><br />

                <h3>Bus</h3>
                <input placeholder="Registrska tablica" value={f.license_plate} onChange={e => set("license_plate", e.target.value)} required /><br />

                <h3>Hotel</h3>
                <input placeholder="Ime hotela" value={f.hotel_name} onChange={e => set("hotel_name", e.target.value)} required /><br />
                <input placeholder="Naslov hotela" value={f.hotel_address} onChange={e => set("hotel_address", e.target.value)} /><br />
                <input type="number" placeholder="Zvezde (1-5)" min="1" max="5" value={f.stars} onChange={e => set("stars", e.target.value)} /><br />
                <label>Check-in: <input type="date" value={f.check_in} onChange={e => set("check_in", e.target.value)} /></label><br />
                <label>Check-out: <input type="date" value={f.check_out} onChange={e => set("check_out", e.target.value)} /></label><br />

                {flights.map((fl, i) => (
                    <div key={i}>
                        <h3>Let {fl.direction === "outbound" ? "(tja)" : "(nazaj)"}</h3>
                        <input placeholder="Številka leta" value={fl.flight_number} onChange={e => setFlight(i, "flight_number", e.target.value)} required /><br />
                        <input placeholder="Letalska družba" value={fl.airline} onChange={e => setFlight(i, "airline", e.target.value)} /><br />
                        <input placeholder="Letališče odhoda" value={fl.departure_airport} onChange={e => setFlight(i, "departure_airport", e.target.value)} /><br />
                        <input placeholder="Letališče prihoda" value={fl.arrival_airport} onChange={e => setFlight(i, "arrival_airport", e.target.value)} /><br />
                        <label>Odhod: <input type="datetime-local" value={fl.departure_time} onChange={e => setFlight(i, "departure_time", e.target.value)} /></label><br />
                        <label>Prihod: <input type="datetime-local" value={fl.arrival_time} onChange={e => setFlight(i, "arrival_time", e.target.value)} /></label><br />
                    </div>
                ))}

                <button type="submit">Ustvari turo</button>
            </form>
            {message && <p>{message}</p>}

            <h2>Vse ture</h2>
            {tours.length === 0 ? <p>Ni tur.</p> : tours.map((t: any) => (
                <div key={t.id}>
                    <p>#{t.id} — {t.title} ({t.departure_date} → {t.return_date})</p>
                    <button onClick={() => deleteTour(t.id)}>Zbriši turo</button>
                </div>
            ))}

            <h2>Vse rezervacije</h2>
            {reservations.length === 0 ? <p>Ni rezervacij.</p> : reservations.map((r: any) => (
                <div key={r.id}>
                    <p>Rezervacija #{r.id} — {r.title}</p>
                    <p>Uporabnik: {r.user_id} | Status: {r.status}</p>
                    {r.passengers?.map((p: any) => (
                        <p key={p.id}>— {p.first_name} {p.last_name}, potni list: {p.passport_number}</p>
                    ))}
                    <button onClick={async () => {
                        await fetch(`${API_URL}/reservations/${r.id}`, { method: "DELETE" });
                        setReservations(prev => prev.filter(x => x.id !== r.id));
                    }}>Zbriši</button>
                </div>
            ))}
        </main>
    );
}