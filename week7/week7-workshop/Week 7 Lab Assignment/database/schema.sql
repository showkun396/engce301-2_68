-- ============================================
-- Library Management System Database Schema
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== BOOKS TABLE =====
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== MEMBERS TABLE =====
-- TODO: นักศึกษาสร้าง table members
-- ต้องมี: id, name, email (UNIQUE), phone, membership_date, status
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    member_id DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL
);


-- ===== BORROWINGS TABLE =====
-- TODO: นักศึกษาสร้าง table borrowings
-- ต้องมี: id, book_id (FK), member_id (FK), borrow_date, due_date, return_date, status
CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL  ,
    member_id INTEGER NOT NULL,
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date   DATETIME  ,
    return_date DATETIME ,
    status TEXT NOT NULL,

    -- ส่วนของการเชื่อมความสัมพันธ์ (Foreign Keys)
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);


-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- TODO: สร้าง indexes สำหรับ members (email)
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);

-- TODO: สร้าง indexes สำหรับ borrowings (book_id, member_id, status)
CREATE INDEX IF NOT EXISTS idx_borrowings_book_id ON borrowings(book_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_member_id ON borrowings(member_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_status ON borrowings(status);

-- ===== SAMPLE DATA: Books =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 3, 3),
    ('Design Patterns', 'Gang of Four', '978-0201633610', 'Programming', 2, 2),
    ('The Pragmatic Programmer', 'Hunt & Thomas', '978-0135957059', 'Programming', 2, 1),
    ('Introduction to Algorithms', 'CLRS', '978-0262033848', 'Computer Science', 5, 5),
    ('Database System Concepts', 'Silberschatz', '978-0078022159', 'Database', 3, 2);

-- ===== SAMPLE DATA: Members =====
-- TODO: Insert 3 members
INSERT INTO members (name, email, phone, member_id, status) VALUES
    ('Son', 'son99@gmail.com', '845-15568428', NULL, 'Active'),
    ('Koco', 'Koco888@gmail.com', '846-14569451', NULL, 'Active'),
    ('Marado', 'Mado999@gmail.com', '785-555-4810', NULL, 'Active');

-- ===== SAMPLE DATA: Borrowings =====
-- TODO: Insert 3 borrowings (บางเล่มยืมอยู่, บางเล่มคืนแล้ว)
INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, return_date, status) VALUES
    (1, 1, '2024-03-01 10:00:00', '2024-03-08 10:00:00', NULL, 'borrowed'), -- เล่มที่ 1 ยังไม่คืน
    (2, 2, '2024-02-15 09:30:00', '2024-02-22 09:30:00', '2024-02-20 15:00:00', 'returned'), -- เล่มที่ 2 คืนแล้ว
    (3, 1, '2024-03-05 14:00:00', '2024-03-12 14:00:00', NULL, 'borrowed'); -- เล่มที่ 3 ยังไม่คืน