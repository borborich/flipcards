<?php

require_once(__DIR__ . '/../includes/db_connection.php');

if(isset($_GET['theme'])) {
    $theme = $_GET['theme'];

    $query = "SELECT russian_word, foreign_word FROM italian_words WHERE theme = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $theme);
    $stmt->execute();
    $result = $stmt->get_result();

    $word_pairs = array();
    while ($row = $result->fetch_assoc()) {
        $word_pairs[] = array(
            'russian_word' => $row['russian_word'],
            'foreign_word' => $row['foreign_word']
        );
    }

    echo json_encode($word_pairs);
    exit;
}

$conn->close();
?>
