import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://88.200.63.148:3001";

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Registracija uspešna!");
                navigate("/login");
            } else {
                setMessage(data.error || "Napaka pri registraciji.");
            }
        } catch (err) {
            setMessage("Napaka strežnika.");
        }
    };

    return (
        <main>
            <h1>Registracija</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Ime</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label>Priimek</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                    <label>Telefon</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Geslo</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Registracija</button>
            </form>
            {message && <p>{message}</p>}
        </main>
    );
}