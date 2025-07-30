require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

class User {
    constructor(userId, timezone) {
        this.userId = userId;
        this.timezone = timezone;
    }

    static async get(userId) {
        const sql = 'SELECT * FROM users WHERE userId = ? LIMIT 1';
        const [rows] = await pool.execute(sql, [userId]);

        if (rows.length === 0) {
            return null;
        } else {
            return new User(rows[0].userId, rows[0].timezone);
        }
    }

    async save() {
        const sql = `
            INSERT INTO users (userId, timezone) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE timezone = ?
        `;

        await pool.execute(sql, [this.userId, this.timezone, this.timezone]);
    }

    static async delete(userId) {
        const sql = 'DELETE FROM users WHERE userId = ?';
        const [result] = await pool.execute(sql, [userId]);

        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
    }
}

module.exports = User;

