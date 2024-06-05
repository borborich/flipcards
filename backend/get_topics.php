<?php

require_once(__DIR__ . '/../includes/db_connection.php');

$topic_info = array();

// Проверка наличия параметра id в запросе
if(isset($_GET['id'])) {
    $id = $_GET['id'];
    // Подготовка запроса для выбора топика по ID
    $query = "SELECT id, topic, audio_file, title FROM italian_topics WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $topic_info = array(
            'id' => $row['id'],
            'topic' => $row['topic'],
            'audio_file' => $row['audio_file'],
            'title' => $row['title'],
        );
    }
} else {
    // Подготовка запроса для выбора всех топиков
    $query = "SELECT id, topic, audio_file, title FROM italian_topics";
    $result = $conn->query($query);

    while ($row = $result->fetch_assoc()) {
        $topic_info[] = array(
            'id' => $row['id'],
            'topic' => $row['topic'],
            'audio_file' => $row['audio_file'],
            'title' => $row['title'],
        );
    }
}

// Возврат данных в формате JSON
echo json_encode($topic_info);

$conn->close();
?>
