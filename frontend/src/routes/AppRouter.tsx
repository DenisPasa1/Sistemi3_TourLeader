import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Menu from "../components/Menu";
import Tours from "../pages/Tours";
import SingleTour from "../pages/SingleTour";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path="/" element={<Tours />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tours/:id" element={<SingleTour />} />
            </Routes>
        </BrowserRouter>
    );
}