<?php
// backend/db.php - Database connection and initialization
$db_file = __DIR__ . '/database.sqlite';
$pdo = new PDO("sqlite:" . $db_file);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);

// Initialize tables if they don't exist
$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT,
    dept TEXT,
    salary REAL,
    join_date DATE,
    status TEXT
)");

// Insert default admin if not exists
$stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = 'admin'");
$stmt->execute();
if ($stmt->fetchColumn() == 0) {
    $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $pdo->prepare("INSERT INTO users (username, password, role) VALUES ('admin', ?, 'Administrator')")->execute([$hashedPassword]);
}

// Insert mock employees if table is empty
$stmt = $pdo->prepare("SELECT COUNT(*) FROM employees");
$stmt->execute();
if ($stmt->fetchColumn() == 0) {
    $mock_employees = [
        ['Megersa Bekele', 'megersa.b@ddu.edu.et', '+251 911 123456', 'Department Head', 'Software Engineering', 45000, '2020-09-01', 'Active'],
        ['Mebrahtu Sefie', 'mebrahtu.s@ddu.edu.et', '+251 922 234567', 'Senior Lecturer', 'Computer Science', 38000, '2021-02-15', 'Active'],
        ['Sisay Melese', 'sisay.m@ddu.edu.et', '+251 933 345678', 'Assistant Professor', 'Information Technology', 42000, '2019-11-10', 'Remote'],
        ['Mirikat Dawit', 'mirikat.d@ddu.edu.et', '+251 944 456789', 'Lab Assistant', 'Software Engineering', 25000, '2022-03-20', 'Active'],
        ['Solomon Geta', 'solomon.g@ddu.edu.et', '+251 955 567890', 'IT Specialist', 'Information Technology', 30000, '2023-01-05', 'Active'],
    ];
    $stmt = $pdo->prepare("INSERT INTO employees (name, email, phone, role, dept, salary, join_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($mock_employees as $emp) {
        $stmt->execute($emp);
    }
}

return $pdo;
