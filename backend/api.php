<?php
// backend/api.php - Full CRUD API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$pdo = require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'get_employees':
        $stmt = $pdo->query("SELECT * FROM employees ORDER BY id DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'login':
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            echo json_encode(['success' => true, 'user' => ['username' => $user['username'], 'role' => $user['role']]]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
        break;

    case 'add_employee':
        $stmt = $pdo->prepare("INSERT INTO employees (name, email, phone, role, dept, salary, join_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $success = $stmt->execute([
            $input['name'],
            $input['email'],
            $input['phone'],
            $input['role'],
            $input['dept'],
            $input['salary'],
            $input['join_date'],
            $input['status']
        ]);
        echo json_encode(['success' => $success]);
        break;

    case 'update_employee':
        $stmt = $pdo->prepare("UPDATE employees SET name = ?, email = ?, phone = ?, role = ?, dept = ?, salary = ?, join_date = ?, status = ? WHERE id = ?");
        $success = $stmt->execute([
            $input['name'],
            $input['email'],
            $input['phone'],
            $input['role'],
            $input['dept'],
            $input['salary'],
            $input['join_date'],
            $input['status'],
            $input['id']
        ]);
        echo json_encode(['success' => $success]);
        break;

    case 'delete_employee':
        $stmt = $pdo->prepare("DELETE FROM employees WHERE id = ?");
        $success = $stmt->execute([$_GET['id']]);
        echo json_encode(['success' => $success]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
