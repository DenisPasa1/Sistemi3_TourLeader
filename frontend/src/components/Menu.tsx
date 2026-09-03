import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };
    return (
        <nav>
            <Link to="/">Tour-Leader</Link>
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
            {user && user.role === "admin" && <Link to="/admin">Admin Panel</Link>}
            {user?.role === "guide" && <Link to="/guide">Moj panel</Link>}
            {user && <Link to="/profile">Profile</Link>}
        </nav>
    );
}