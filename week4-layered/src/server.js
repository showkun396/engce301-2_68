require('dotenv').config();
const express = require('express');
const path = require('path'); // เพิ่ม path module
const database = require('../database/connection'); // ถอย 1 ชั้นไปหา database
const taskController = require('./controllers/taskController'); // อยู่ใน src เหมือนกัน ใช้ ./
const errorHandler = require('./middleware/errorHandler');
//const logger = require('./utils/logger');

// 🚩 จุดสำคัญ: สร้าง Route ตรงนี้เลยถ้ายังไม่มีไฟล์ routes แยก
const router = express.Router();

router.get('/stats', taskController.getStatistics);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/next-status', taskController.moveToNextStatus); // PATCH ตัวนี้ path ไม่ตรงกับที่หน้าบ้านเรียก
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/next-status', taskController.moveToNextStatus);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// ชี้ไปที่โฟลเดอร์ public ที่อยู่นอก src
app.use(express.static(path.join(__dirname, '../public')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// 🚩 เรียกใช้ Router ที่เราทำไว้ข้างบน
app.use('/api/tasks', router);

// Error Handler (ต้องอยู่ล่างสุด)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 เซิร์ฟเวอร์ทำงานที่ http://localhost:${PORT}`);
});