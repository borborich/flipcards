<?php
// Параметры подключения к базе данных
$servername = "localhost"; // Имя сервера базы данных
$username = "username"; // Имя пользователя базы данных
$password = "bd_user_password"; // Пароль пользователя базы данных
$dbname = "bdname"; // Имя базы данных

// Создание соединения с базой данных
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

// Проверка соединения на наличие ошибок
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
