import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };
    return (
        <nav>
            <Link to="/">Tours</Link>
            {user && (
                <>
                    <span>Hello, {user.first_name}</span>
                    <button onClick={handleLogout}>Logout</button>
                    <Link to="/my-reservations">My Reservations</Link>
                </>
            )}
            {!user && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}