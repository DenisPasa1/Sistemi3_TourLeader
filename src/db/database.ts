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

export default pool;