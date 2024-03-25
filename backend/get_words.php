<?php

require_once(__DIR__ . '/../includes/db_connection.php');

if(isset($_GET['theme'])) {
    $theme = $_GET['theme'];

    $query = "SELECT russian_word, foreign_word, language_code FROM italian_words WHERE theme = ? ORDER BY id ASC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $theme);
    $stmt->execute();
    $result = $stmt->get_result();

    $word_pairs = array();
    while ($row = $result->fetch_assoc()) {
        $word_pairs[] = array(
            'russian_word' => $row['russian_word'],
            'foreign_word' => $row['foreign_word'],
            'foreign_word_lang' => $row['language_code'],
        );
    }

    echo json_encode($word_pairs);
    exit;
}

$conn->close();
?>
