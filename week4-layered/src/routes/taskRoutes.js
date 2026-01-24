const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// เชื่อมโยง URL กับฟังก์ชันใน Controller
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/stats', taskController.getStatistics);
router.patch('/:id/next-status', taskController.moveToNextStatus);

module.exports = router;