import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export interface User extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password_hash: string;
    role: string;
}
export interface Tour extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    departure_date: string;
    return_date: string;
    price_per_person: number;
    max_seats: number;
    available_seats: number;
    category: string;
    image: string;
    destination_id: number;
    guide_id: number;
}
export interface Reservation extends RowDataPacket {
    id: number;
    reserved_at: string;
    status: string;
    user_id: number;
    tour_id: number;
}
export interface Bus extends RowDataPacket {
    id: number;
    license_plate: string;
    total_seats: number;
    tour_id: number;
}
export interface BusSeat extends RowDataPacket {
    id: number;
    seat_number: string;
    bus_id: number;
    reservation_id: number;
}
export interface Destination extends RowDataPacket {
    id: number;
    country: string;
    city: string;
    description: string;
}
export interface Flight extends RowDataPacket {
    id: number;
    flight_number: string;
    airline: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    direction: string;
    tour_id: number;
}
export interface Guide extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    bio: string;
    languages: string;
    photo: string;
}
export interface Hotel extends RowDataPacket {
    id: number;
    name: string;
    address: string;
    stars: number;
    check_in: string;
    check_out: string;
    tour_id: number;
}
export interface Passenger extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    passport_number: string;
    passport_expiry: string;
    reservation_id: number;
}
export interface Waitlist extends RowDataPacket {
    id: number;
    joined_at: string;
    notified: boolean;
    user_id: number;
    tour_id: number;
}


export const getUserByEmail = async (email: string): Promise<User[]> => {
    const [rows] = await pool.query<User[]>(
        "SELECT * FROM user WHERE email = ?", [email]
    );
    return rows;
};

export const createUser = async (
    first_name: string,
    last_name: string,
    email: string,
    phone: string | null,
    password_hash: string
): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO user (first_name, last_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, 'customer')",
        [first_name, last_name, email, phone, password_hash]
    );
    return result;
};
export const getAllTours = async (): Promise<Tour[]> => {
    const [rows] = await pool.query<Tour[]>(
        "SELECT * FROM tour",
    );
    return rows;
}
export const getTourById = async (id: number): Promise<Tour[]> => {
    const [rows] = await pool.query<Tour[]>(
        "SELECT * FROM tour WHERE id = ?", [id]
    );
    return rows;
}
export const createReservation = async (
    status: string,
    user_id: number,
    tour_id: number
): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO reservation (reserved_at, status, user_id, tour_id) VALUES (NOW(),?,?,?)", [status, user_id, tour_id]
    );
    return result;
}
export const getReservationsByUserId = async (userId: number): Promise<Reservation[]> => {
    const [rows] = await pool.query<Reservation[]>(
        `SELECT r.*, t.title, t.departure_date, t.return_date 
         FROM reservation r 
         JOIN tour t ON r.tour_id = t.id 
         WHERE r.user_id = ?`, [userId]
    );
    return rows;
}
export const getBusByTourId = async (tourId: number): Promise<Bus[]> => {
    const [rows] = await pool.query<Bus[]>(
        "SELECT * FROM bus WHERE tour_id = ?", [tourId]
    );
    return rows;
}
export const getBusSeatsByBusId = async (busId: number): Promise<BusSeat[]> => {
    const [rows] = await pool.query<BusSeat[]>(
        "SELECT * FROM bus_seat WHERE bus_id =?", [busId]
    );
    return rows;
}
export const getAllDestinations = async (): Promise<Destination[]> => {
    const [rows] = await pool.query<Destination[]>(
        "SELECT * FROM destination",
    );
    return rows;
}
export const getDestinationById = async (id: number): Promise<Destination[]> => {
    const [rows] = await pool.query<Destination[]>(
        "SELECT * FROM destination WHERE id = ?", [id]
    );
    return rows;
}
export const getFlightByTourId = async (tourId: number): Promise<Flight[]> => {
    const [rows] = await pool.query<Flight[]>(
        "SELECT * FROM flight WHERE tour_id = ?", [tourId]
    );
    return rows;
}
export const getAllGuides = async (): Promise<Guide[]> => {
    const [rows] = await pool.query<Guide[]>(
        "SELECT * FROM guide",
    );
    return rows;
}
export const getGuideById = async (id: number): Promise<Guide[]> => {
    const [rows] = await pool.query<Guide[]>(
        "SELECT * FROM guide WHERE id = ?", [id]
    );
    return rows;
}
export const getGuideByTourId = async (tourId: number): Promise<Guide[]> => {
    const [rows] = await pool.query<Guide[]>(
        "SELECT g.* FROM guide g JOIN tour t ON g.id = t.guide_id WHERE t.id = ?", [tourId]
    );
    return rows;
}
export const getHotelByTourId = async (tourId: number): Promise<Hotel[]> => {
    const [rows] = await pool.query<Hotel[]>(
        "SELECT * FROM hotel WHERE tour_id = ?", [tourId]
    );
    return rows;
}
export const createPassenger = async (
    first_name: string,
    last_name: string,
    date_of_birth: string,
    passport_number: string,
    passport_expiry: string,
    reservation_id: number
): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO passenger (first_name, last_name, date_of_birth, passport_number, passport_expiry, reservation_id) VALUES (?, ?, ?, ?, ?, ?)",
        [first_name, last_name, date_of_birth, passport_number, passport_expiry, reservation_id]
    );
    return result;
}
export const getAllPassengers = async (): Promise<Passenger[]> => {
    const [rows] = await pool.query<Passenger[]>(
        "SELECT * FROM passenger",
    );
    return rows;
}
export const getPassengerByReservationId = async (tourId: number): Promise<Passenger[]> => {
    const [rows] = await pool.query<Passenger[]>(
        "SELECT * FROM passenger WHERE reservation_id = ?", [tourId]
    );
    return rows;
}
export const joinWaitlist = async (
    user_id: number,
    tour_id: number
): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO waitlist (joined_at, notified, user_id, tour_id) VALUES (NOW(), false, ?, ?)",
        [user_id, tour_id]
    );
    return result;
}
export const getWaitlistByTourId = async (tourId: number): Promise<Waitlist[]> => {
    const [rows] = await pool.query<Waitlist[]>(
        "SELECT * FROM waitlist WHERE tour_id = ?", [tourId]
    );
    return rows;
}
export const getWaitlistByUserId = async (userId: number): Promise<Waitlist[]> => {
    const [rows] = await pool.query<Waitlist[]>(
        "SELECT * FROM waitlist WHERE user_id = ?", [userId]
    );
    return rows;
}
export default pool;