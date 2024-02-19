<?php
// Путь к файлу лога
$log_file = __DIR__ . '/../logs/get_word.log';

// Функция для записи сообщений в лог файл
function write_log($message) {
    global $log_file;
    file_put_contents($log_file, $message . PHP_EOL, FILE_APPEND);
}

// Подключение к базе данных
require_once(__DIR__ . '/../includes/db_connection.php');

// Функция для выбора случайного слова и вариантов перевода в соответствии с направлением языков и темой
function getRandomWord($fromLanguage, $toLanguage, $theme) {
    global $conn;

    // Определение столбцов для выборки в зависимости от направления языков
    $wordColumn = $fromLanguage . '_word';
    $translationColumn = $toLanguage . '_word';

    // Подготовка запроса с условием выборки слов из указанной темы
    $themeCondition = $theme ? " AND theme = '$theme'" : "";
    
    // Выбор случайной записи из таблицы с учетом указанной темы
    $query = "SELECT * FROM italian_words WHERE 1 $themeCondition ORDER BY RAND() LIMIT 1"; // Замените italian_words на имя вашей таблицы

    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $word = $row[$wordColumn];
        $correctTranslation = $row[$translationColumn];
        write_log("Результат первого запроса: $word , $correctTranslation");

        // Выбор трех случайных вариантов перевода из других записей
        $choices_query = "SELECT * FROM italian_words WHERE $translationColumn != '$correctTranslation' $themeCondition ORDER BY RAND() LIMIT 3";

        $choices_result = $conn->query($choices_query);

        $choices = array();
        while ($row = $choices_result->fetch_assoc()) {
            $choices[] = $row[$translationColumn];
        }

        // Добавление верного варианта перевода к остальным вариантам и перемешивание
        $choices[] = $correctTranslation;
        shuffle($choices);

        // Формирование массива данных для ответа, включая корректный перевод
        $response = array(
            'word' => $word,
            'correct_translation' => $correctTranslation, // Добавление корректного перевода
            'choices' => $choices
        );

        // Преобразование массива в строку перед записью в лог
        $response_str = json_encode($response, JSON_UNESCAPED_UNICODE);
        write_log("json Массив ответа: $response_str");

        return $response;
    } else {
        $error_message = "No words found";
        write_log("Error: $error_message");
        return null;
    }
}

// Функция для получения количества записей каждой темы и общего количества записей
function getThemeCounts() {
    global $conn;

    $query = "SELECT theme, COUNT(*) AS count FROM italian_words GROUP BY theme"; // Замените italian_words на имя вашей таблицы
    $result = $conn->query($query);

    $themeCounts = array();
    while ($row = $result->fetch_assoc()) {
        $themeCounts[$row['theme']] = $row['count'];
    }

    // Добавляем общее количество записей
    $totalQuery = "SELECT COUNT(*) AS total_count FROM italian_words"; // Замените italian_words на имя вашей таблицы
    $totalResult = $conn->query($totalQuery);
    $totalRow = $totalResult->fetch_assoc();
    $themeCounts['total'] = $totalRow['total_count'];

    return $themeCounts;
}

// Функция для получения количества записей по выбранной теме
function getThemeCount($theme) {
    global $conn;

    $query = "SELECT COUNT(*) AS count FROM italian_words WHERE theme = '$theme'"; // Замените italian_words на имя вашей таблицы и добавьте нужные фильтры
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    return $row['count'];
}

// Функция для получения общего количества записей всех тем
function getTotalCount() {
    global $conn;

    $query = "SELECT COUNT(*) AS total_count FROM italian_words"; // Замените italian_words на имя вашей таблицы
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    return $row['total_count'];
}

// Для обработки запроса о количестве записей в каждой теме и общего количества записей
if (isset($_GET['total_count'])) {
    $totalCount = getTotalCount();
    echo json_encode(array('total_count' => $totalCount));
} else if (isset($_GET['theme_count']) && isset($_GET['theme'])) {
    $themeCount = getThemeCount($_GET['theme']);
    echo json_encode(array('count' => $themeCount));
} else {
    // Обработка запроса на получение случайного слова
    $fromLanguage = "russian"; // Измените, если нужно
    $toLanguage = "foreign"; // Измените, если нужно
    $theme = isset($_GET['theme']) ? $_GET['theme'] : "";

    // Если в запросе передан параметр lang со значением "invert", меняем направление языков
    if (isset($_GET['lang']) && $_GET['lang'] === "invert") {
        $fromLanguage = "foreign";
        $toLanguage = "russian";
    }

    // Получаем случайное слово и варианты перевода
    $responseData = getRandomWord($fromLanguage, $toLanguage, $theme);

    // Возвращаем результат в виде JSON
    if ($responseData !== null) {
        header('Content-Type: application/json');
        echo json_encode($responseData);
    } else {
        $error_message = "No words found";
        echo $error_message;
    }
}

// Закрытие соединения с базой данных
$conn->close();
?>
