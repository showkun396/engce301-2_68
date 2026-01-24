const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// ตั้งค่า Path ให้ถูกต้อง (ถอยออกจากโฟลเดอร์ database ไปหาไฟล์ .db ที่ root)
const dbPath = process.env.DB_PATH || path.join(__dirname, '../tasks.db');

// สร้างการเชื่อมต่อทันทีที่ไฟล์ถูกโหลด
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ เชื่อมต่อฐานข้อมูลล้มเหลว:', err.message);
    } else {
        console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จที่:', dbPath);
        db.run('PRAGMA foreign_keys = ON');
    }
});

// ส่ง Object ที่มี Helper functions ออกไป
module.exports = {
    run: (sql, params = []) => new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    }),
    get: (sql, params = []) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    }),
    all: (sql, params = []) => new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    })
};