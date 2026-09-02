import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Menu from "../components/Menu";
import Tours from "../pages/Tours";
import SingleTour from "../pages/SingleTour";
import Reservation from "../pages/Reservation";
import MyReservations from "../pages/MyReservations";
import Waitlist from "../pages/Waitlist";
import AdminPanel from "../pages/AdminPanel";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path="/" element={<Tours />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tours/:id" element={<SingleTour />} />
                <Route path="/tours/:id/reserve" element={<Reservation />} />
                <Route path="/my-reservations" element={<MyReservations />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
    );
}