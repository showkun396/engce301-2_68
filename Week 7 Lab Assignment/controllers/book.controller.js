// ฟังก์ชันสำหรับ GET (ดึงข้อมูล)
const getBookById = (req, res) => {
    const id = req.params.id;
    res.json({
        success: true,
        message: `ดึงข้อมูลหนังสือ ID: ${id} สำเร็จ`,
        data: { id: id, title: "ชื่อหนังสือจาก DB" }
    });
};

// ฟังก์ชันสำหรับ POST (สร้างข้อมูลใหม่)
const createBook = (req, res) => {
    const newData = req.body;
    res.status(201).json({
        success: true,
        message: "เพิ่มข้อมูลสำเร็จ (Mockup)",
        data: newData
    });
};

// *** สำคัญ: ชื่อที่อยู่ตรงนี้ ต้องตรงกับชื่อฟังก์ชันข้างบน ***
module.exports = {
    getBookById,
    createBook
};