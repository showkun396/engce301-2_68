const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// ... โค้ด router.get หรือ router.post ต่างๆ ...
router.get('/', (req, res) => {
    res.json({ message: "Get all books success" });
});

// เพิ่มอันนี้เข้าไปเพื่อรับ ID
router.get('/:id', bookController.getBookById);
// เพิ่มการรองรับ POST request
router.post('/', bookController.createBook);
// *** บรรทัดนี้สำคัญที่สุด ห้ามลืมเด็ดขาด ***
module.exports = router;