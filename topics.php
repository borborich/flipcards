<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Мета-описание -->
    <meta name="title" content="Заговорить на итальянском">
    <meta name="description" content="Простое приложение для выучивания базовых итальянских слов для легкого вхождения в язык">
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
    <title>Случайный топик</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css?version=2.2">
    <script src="js/script.js?version=2.2"></script>
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

    <div class="container">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">&nbsp;</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item ">
                <a class="nav-link" href="index.php">🏠 Домашняя <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="table.php">📚 Таблицы</a>
              </li>
              <li class="nav-item active">
                <a class="nav-link" href="topics.php">🗂️ Топики</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="donate.php">👍 Поддержать приложение</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="settings.php">⚙️ Настройки озвучивания</a>
              </li>
            </ul>
          </div>
        </nav>
        <div class="row mt-3">
            <div class="col">
                <h1>Случайный топик</h1>
                <div id="topic-content" class="mt-4">
                    <p id="topic-text"></p>
                    <p><strong>Аудио файл:</strong> <span id="audio-file"></span></p>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            fetch('backend/get_topics.php')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('topic-text').innerText = data.topic;
                    document.getElementById('audio-file').innerText = data.audio_file;
                })
                .catch(error => console.error('Ошибка:', error));
        });
    </script>

</body>
</html>
