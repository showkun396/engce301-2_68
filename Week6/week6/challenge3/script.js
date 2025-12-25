// รอให้ DOM โหลดเสร็จก่อน
document.addEventListener('DOMContentLoaded', function() {
    // หา Element ที่มี ID 'myButton'
    const button = document.querySelector('ul');

    // เพิ่ม Event Listener สำหรับ 'click'
    button.addEventListener('click', function() {
        alert('สวัสดีครับ! นี่คือการคลิกจากไฟล์ .js');
        
    });
});
