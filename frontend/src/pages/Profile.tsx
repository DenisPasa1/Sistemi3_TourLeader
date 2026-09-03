import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001";

export default function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const [form, setForm] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        if (!user) navigate("/login");
    }, []);

    const handleProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            const updated = { ...user, ...form };
            localStorage.setItem("user", JSON.stringify(updated));
            setProfileMessage("Profil posodobljen!");
        } else {
            const err = await res.json();
            setProfileMessage("Napaka: " + err.error);
        }
    };

    const handlePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordMessage("Gesli se ne ujemata.");
            return;
        }
        const res = await fetch(`${API_URL}/users/${user.id}/password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
            }),
        });
        if (res.ok) {
            setPasswordMessage("Geslo posodobljeno!");
            setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
        } else {
            const err = await res.json();
            setPasswordMessage("Napaka: " + err.error);
        }
    };

    return (
        <main>
            <h1>Moj profil</h1>
            <p>Email: {user?.email}</p>

            <h2>Uredi profil</h2>
            <form onSubmit={handleProfile}>
                <input placeholder="Ime" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required /><br />
                <input placeholder="Priimek" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required /><br />
                <input placeholder="Telefon" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /><br />
                <button type="submit">Shrani</button>
            </form>
            {profileMessage && <p>{profileMessage}</p>}

            <h2>Spremeni geslo</h2>
            <form onSubmit={handlePassword}>
                <input type="password" placeholder="Trenutno geslo" value={passwordForm.current_password} onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })} required /><br />
                <input type="password" placeholder="Novo geslo" value={passwordForm.new_password} onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })} required /><br />
                <input type="password" placeholder="Potrdi novo geslo" value={passwordForm.confirm_password} onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })} required /><br />
                <button type="submit">Spremeni geslo</button>
            </form>
            {passwordMessage && <p>{passwordMessage}</p>}
        </main>
    );
}