<?php

require_once(__DIR__ . '/../includes/db_connection.php');

// Подготовка запроса для выбора случайной записи
$query = "SELECT id, topic, audio_file FROM italian_topics ORDER BY RAND() LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$topic_info = array();
if ($row = $result->fetch_assoc()) {
    $topic_info = array(
        'id' => $row['id'],
        'topic' => $row['topic'],
        'audio_file' => $row['audio_file'],
    );
}

// Возврат данных в формате JSON
echo json_encode($topic_info);

$conn->close();
?>
