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
    <title>Таблица слов</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css?version=2">
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
                <a href="index.php" class="btn btn-secondary">🏠 Главная</a>
            </div>
            <div class="col text-center">
                <a href="donate.php" class="btn btn-secondary">👍 Поддержать</a>
            </div>
            <div class="col text-right">
                <a href="cards.php" class="btn btn-secondary">🗂️ Карточки</a>
            </div>
        </div>
    </div>
    <div class="container mt-2">
        <div class="row">
            <div class="col">
                    <h1>Таблица слов</h1>

                    <form id="theme-form" class="form-inline mt-4">
                        <select id="theme-select-table" class="form-control mr-sm-3">
                            <!-- Опции будут добавлены динамически с помощью JavaScript -->
                        </select>
                    </form>
                    

                    <div id="below-form-content"> <!-- Контейнер для элементов, которые нужно скрыть -->
                        <a class="btn btn-primary mt-4 cards-link" href="#">Перейти к карточкам этого урока</a>
                        <br><br>
                        <p>Нажатие на любое слово озвучит его произношение 🔊</p>
                    </div>

                    <div id="word-table" class="mt-4 table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Русский</th>
                                    <th scope="col">Итальянский</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Здесь будут отображаться данные из базы данных -->
                            </tbody>
                        </table>
                    </div>
                    <a class="btn btn-primary mt-4 cards-link" href="#">Перейти к карточкам этого урока</a>
            </div>
        </div>
    </div>

    <script src="js/script.js?version=2"></script>
</body>
</html>
