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

// Начать сеанс PHP
session_start();

// Функция для выбора случайного слова и вариантов перевода в соответствии с направлением языков и темой
function getRandomWord($fromLanguage, $toLanguage, $theme) {
    global $conn;
    write_log("Current language parameters: $fromLanguage -> $toLanguage");

    // Определение столбцов для выборки в зависимости от направления языков
    $wordColumn = $fromLanguage . '_word';
    $translationColumn = $toLanguage . '_word';

    // Получить список уже использованных слов из сеанса PHP
    $usedWords = isset($_SESSION['used_words']) ? $_SESSION['used_words'] : array();

    // Подготовка запроса с условием выборки слов из указанной темы и исключением уже использованных слов
    $themeCondition = $theme ? " AND theme = '$theme'" : "";
    $usedWordsCondition = !empty($usedWords) ? " AND $wordColumn NOT IN ('" . implode("','", $usedWords) . "')" : "";
    
    // Выбор случайной записи из таблицы с учетом указанной темы и исключением использованных слов
    $query = "SELECT * FROM italian_words WHERE 1 $themeCondition $usedWordsCondition ORDER BY RAND() LIMIT 1"; // Замените italian_words на имя вашей таблицы

    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $word = $row[$wordColumn];
        $correctTranslation = $row[$translationColumn];
        write_log("Результат первого запроса: $word , $correctTranslation");

        // Добавить использованное слово в список
        $usedWords[] = $word;
        $_SESSION['used_words'] = $usedWords;

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

        return $response;
    } else {
        // Если нет слов для выбора, вернуть флаг завершения списка
        $response = array(
            'end_of_list' => true
        );
        return $response;
    }
}

// Обработка запроса на очистку списка использованных слов
if (isset($_GET['clear_used_words'])) {
    // Очистить список использованных слов
    $_SESSION['used_words'] = array();
    // Возвращаем успех
    echo json_encode(array('success' => true));
    exit;
}


// Функция для получения количества записей по выбранной теме
function getThemeCount($theme) {
    global $conn;

    $query = "SELECT COUNT(*) AS count FROM italian_words WHERE theme = '$theme'"; // Замените italian_words на имя вашей таблицы и добавьте нужные фильтры
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    return $row['count'];
}

// Функция для получения уникальных тем
function getUniqueThemes() {
    global $conn;

    $query = "SELECT DISTINCT theme FROM italian_words ORDER BY CAST(theme AS UNSIGNED) ASC"; 
    $result = $conn->query($query);

    $themes = array();
    while ($row = $result->fetch_assoc()) {
        $themes[] = $row['theme'];
    }

    return $themes;
}

// Обработка запроса о получении списка уникальных тем
if (isset($_GET['unique_themes'])) {
    $uniqueThemes = getUniqueThemes();
    echo json_encode($uniqueThemes);
    exit; // Важно завершить выполнение скрипта после отправки списка тем
}

// Функция для получения общего количества записей всех тем
function getTotalCount() {
    global $conn;

    $query = "SELECT COUNT(*) AS total_count FROM italian_words"; 
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
