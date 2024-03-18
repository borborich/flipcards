<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Мета-описание -->
    <meta name="title" content="Заговорить на итальянском">
    <meta name="description" content="Простое приложение выучивания базовых итальянских слов для легкого вхождения в язык">
    <!-- Теги -->
    <meta name="keywords" content="итальянский, слова, учеба, иностранный язык, изучение, Петров, Полиглот">
    <!-- Изображения -->
    <meta property="og:image" content="img/favicon.png">
    <meta property="twitter:image" content="img/favicon.png">
    <!-- Иконки для установки на устройства -->
    <!-- iOS -->
    <link rel="apple-touch-icon" sizes="180x180" href="img/favicon.png">
    <!-- Android -->
    <link rel="icon" type="image/png" sizes="192x192" href="img/favicon.png">
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon.png">
    <title>Изучение иностранных слов</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-T24M5R7GHF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-T24M5R7GHF');
    </script>
</head>
<body>
    <div class="container mt-2">
        <div class="row">
            <div class="col text-left">
                <a href="index.php" class="btn btn-secondary">Главная страница</a>
            </div>
            <div class="col text-center">
                <a href="donate.php" class="btn btn-secondary">👍 Поддержать</a>
            </div>
            <div class="col text-right">
                <a href="table.php" class="btn btn-secondary">Перейти к таблицам</a>
            </div>
        </div>
    </div>
    <div class="container mt-2">
        <div class="row">
            <div class="col">
                <div id="record-count"></div> <!-- Вывод общего количества записей или количество записей в выбранной теме -->
                 <!-- <div id="total-questions"></div> Вывод общего количества вопросов -->
            </div>
            <div class="col">
                <div id="correct-answers"></div> <!-- Вывод количества правильных ответов -->
            </div>
            <div class="col">
                <div id="incorrect-answers"></div> <!-- Вывод количества неправильных ответов -->
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <select id="theme-select" class="form-control mb-3">
                    <!-- Опции будут добавлены динамически с помощью JavaScript -->
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col">
                        <button id="invert" class="btn btn-primary btn-block">инвертировать языки</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <div id="video-container"></div>
                <div id="word" class="card" data-lang="">
                    <!-- Содержимое карточки слова будет добавлено с помощью JavaScript -->
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <div class="row mt-2">
                    <div class="col">
                        <div class="choice"></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <div class="choice"></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <div class="choice"></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <div class="choice"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <script src="js/script.js"></script>
</body>
</html>
