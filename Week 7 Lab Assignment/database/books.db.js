const db = require('./connection');

class BookDatabase {
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = 'SELECT * FROM books ORDER BY id DESC';
        
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: นักศึกษาเขียน findById
    static findById(id) {
        // เขียนโค้ดตรงนี้
        const sql = `
        SELECT 
            p.*,
            c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
        `;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // TODO: นักศึกษาเขียน search (ค้นหาจาก title หรือ author)
    static search(keyword) {
        // เขียนโค้ดตรงนี้
        const searchPattern = `%${keyword}%`;

        const sql =`
        SELECT * FROM books 
        WHERE title LIKE ? OR author LIKE ?
    `;

        return new Promise((resolve, reject) => {
            // ส่ง searchPattern เข้าไปแทนที่ ? ทั้งสองตัว
            db.all(sql, [searchPattern, searchPattern], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // TODO: นักศึกษาเขียน create
    static create(bookData) {
        // เขียนโค้ดตรงนี้
        // เตรียมคำสั่ง SQL โดยระบุคอลัมน์ที่ต้องการเพิ่มข้อมูล
        const sql = `
        INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
            // ดึงค่าจาก Object bookData มาเรียงลำดับให้ตรงกับ ?
        const params = [
            bookData.title,
            bookData.author,
            bookData.isbn,
            bookData.category,
            bookData.total_copies,
            bookData.total_copies // ตอนสร้างใหม่ ค่าว่างมักจะเท่ากับจำนวนทั้งหมด
        ];

        return new Promise((resolve, reject) => {
        // ใช้ db.run สำหรับคำสั่ง INSERT, UPDATE, DELETE
        // ใน callback function เราสามารถเข้าถึงค่า 'this' เพื่อดูข้อมูลหลังการรันได้
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                // this.lastID จะคืนค่า id ของแถวล่าสุดที่เพิ่งถูกเพิ่มเข้าไป
                resolve({ id: this.lastID, ...bookData });
            }
        });
    });  
}

    // TODO: นักศึกษาเขียน update
    static update(id, bookData) {
        // เขียนโค้ดตรงนี้
        const sql = `
        UPDATE books
        SET name = ?,
            category_id = ?,
            price = ?,
            stock = ?,
            description = ?
        WHERE id = ?
    `;
        const params = [
            bookData.title,
            bookData.author,
            bookData.isbn,
            bookData.category,
            bookData.total_copies,
            bookData.available_copies,
            id
        ];
        return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                // this.changes จะบอกจำนวนแถวที่ถูกแก้ไขจริง
                // ถ้าเป็น 0 แสดงว่าหา id นั้นไม่เจอ
                resolve({ changes: this.changes });
            }
        });
    });
}

    // ✅ ให้โค้ดสมบูรณ์ - ฟังก์ชันสำคัญสำหรับ borrowing
    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // TODO: นักศึกษาเขียน increaseAvailableCopies (สำหรับคืนหนังสือ)
    static increaseAvailableCopies(bookId) {
        // เขียนโค้ดตรงนี้
        const sql = `
        UPDATE books
        SET available_copies = available_copies + 1
        WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
        db.run(sql, [bookId], function(err) {
            if (err) {
                reject(err);
            } else {
                // คืนค่าจำนวนแถวที่ถูกแก้ไข (ถ้าเป็น 1 คือสำเร็จ, 0 คือไม่พบหนังสือ ID นี้)
                resolve({ changes: this.changes });
            }
        });
    });
}
}
module.exports = BookDatabase;