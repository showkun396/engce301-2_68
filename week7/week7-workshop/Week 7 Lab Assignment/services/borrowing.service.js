const BorrowingDB = require('../database/borrowings.db');
const BookDB = require('../database/books.db');
const MemberDB = require('../database/members.db');

class BorrowingService {
    // ===== BORROW BOOK =====
    static async borrowBook(borrowData) {
        try {
            const { book_id, member_id } = borrowData;

            // TODO: 1. ตรวจสอบว่า book มีอยู่จริงและมีเล่มว่าง
            const book = await BookDB.findById(book_id);
            if (!book) throw new Error('ไม่พบหนังสือเล่มนี้ในระบบ');
            if (book.available_copies <= 0) throw new Error('หนังสือเล่มนี้ถูกยืมครบทุกเล่มแล้ว');
            

            // TODO: 2. ตรวจสอบว่า member มีอยู่จริงและ status = 'active'
            const member = await MemberDB.findById(member_id);
            if (!member) throw new Error('ไม่พบข้อมูลสมาชิก');
            if (member.status !== 'active') throw new Error('สถานะสมาชิกไม่ปกติ ไม่สามารถยืมได้');

            // TODO: 3. ตรวจสอบว่า member ยืมไม่เกิน 3 เล่ม
            const activeBorrowings = await BorrowingDB.findActiveByMember(member_id);
            if (activeBorrowings && activeBorrowings.length >= 3) {
                throw new Error('สมาชิกยืมหนังสือเกินกำหนด (สูงสุด 3 เล่ม)');
            }

            // TODO: 4. คำนวณ due_date (14 วันจากวันนี้)
            const borrowDate = new Date();
            const dueDate = new Date();
            // เติมโค้ดคำนวณ due_date
            dueDate.setDate(borrowDate.getDate() + 14);
            

            // TODO: 5. สร้าง borrowing record
            const newBorrowing = {
                book_id,
                member_id,
                borrow_date: borrowDate.toISOString(),
                due_date: dueDate.toISOString(),
                status: 'borrowed'
            };
            const result = await BorrowingDB.create(newBorrowing)

            // TODO: 6. ลด available_copies
            await BookDB.decreaseAvailableCopies(book_id);

            return {
                success: true,
                message: 'ยืมหนังสือสำเร็จ',
                data: {
                    borrow_id: result.id,
                    book_title: book.title,
                    due_date: dueDate.toISOString().split('T')[0] // ส่งเฉพาะวันที่กลับไป
                }
            };
        } catch (error) {
            throw error;
        }
    }


    // ===== RETURN BOOK =====
    static async returnBook(borrowingId) {
        try {
            // TODO: 1. ดึงข้อมูล borrowing
            const borrowing = await BorrowingDB.findById(borrowingId);
            if (!borrowing) throw new Error('ไม่พบข้อมูลการยืมนี้');
            

            // TODO: 2. ตรวจสอบว่ายังไม่คืน
            if (borrowing.status === 'returned') {
            throw new Error('หนังสือเล่มนี้ถูกคืนไปเรียบร้อยแล้ว');
            }

            // TODO: 3. บันทึก return_date และเปลี่ยน status
            const returnDate = new Date();
            await BorrowingDB.updateStatus(borrowingId, 'returned', returnDate.toISOString());

            // TODO: 4. เพิ่ม available_copies
            await BookDB.increaseAvailableCopies(borrowing.book_id);

            // TODO: 5. คำนวณค่าปรับ (ถ้าเกิน due_date)
            // ค่าปรับ = 20 บาท/วัน
            let fine = 0;
        const dueDate = new Date(borrowing.due_date);
        
        if (returnDate > dueDate) {
            // คำนวณส่วนต่างของเวลา (มิลลิวินาที) แล้วแปลงเป็นจำนวนวัน
            const diffTime = Math.abs(returnDate - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            fine = diffDays * 20; // ค่าปรับวันละ 20 บาท
        }
            

            return {
            success: true,
            message: 'คืนหนังสือสำเร็จ',
            data: {
                borrow_id: borrowingId,
                return_date: returnDate.toISOString().split('T')[0],
                fine: fine
            }
        };
        } catch (error) {
            throw error;
        }
    }

    // TODO: เขียน getOverdueBorrowings
    static async getOverdueBorrowings() {
    try {
        const sql = `
            SELECT 
                b.id as borrowing_id,
                m.name as member_name,
                bk.title as book_title,
                b.due_date
            FROM borrowings b
            JOIN members m ON b.member_id = m.id
            JOIN books bk ON b.book_id = bk.id
            WHERE b.status = 'borrowed' 
              AND b.due_date < CURRENT_TIMESTAMP
        `;
        
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    } catch (error) {
        throw error;
    }
}
}

module.exports = BorrowingService;