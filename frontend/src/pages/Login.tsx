import { useState } from "react";

const API_URL = "http://88.200.63.148:3001";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Prijava uspešna!");
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                setMessage(data.error || "Napaka pri prijavi.");
            }
        } catch (err) {
            setMessage("Napaka strežnika.");
        }
    };

    return (
        <main>
            <h1>Prijava</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Geslo</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Prijava</button>
            </form>
            {message && <p>{message}</p>}
        </main>
    );
}