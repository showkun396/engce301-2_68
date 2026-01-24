// ตัวอย่าง src/utils/logger.js ที่ถูกต้อง
const winston = require('winston');

const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

module.exports = logger; // ต้องส่งออกแบบนี้เพื่อให้ใช้ logger.info ได้