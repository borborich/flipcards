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
    <title>Настройки</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css?version=2.2">
    <script defer type="module" src="js/script.js?version=2.2"></script>

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
              <li class="nav-item">
                <a class="nav-link" href="index.php">🏠 Домашняя <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="table.php">📚 Таблицы</a>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="cards.php">🗂️ Карточки</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="donate.php">👍 Поддержать приложение</a>
              </li>
              <li class="nav-item active">
                <a class="nav-link" href="settings.php">⚙️ Настройки озвучивания</a>
              </li>
            </ul>
          </div>
        </nav>
    </div>
    <div class="container mt-2">
        <div class="row">
            <div class="col">
                <h3>Выберите голос:</h3>
                    <select id="selectVoice" class="form-control mb-3">
                        <!-- Опции будут добавлены динамически с помощью JavaScript -->
                    </select>
                <p class="blockquote-footer">Обязательно послушайте как звучат все голоса. Если вы не видите никакого голоса в списке, значит, в вашей системе не включен итальянский язык. Перейдите в настройки устройства и добавьте итальянский язык, затем перезагрузите устройство.</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h3>Можно ввести ваш текст для произношения:</h3>
                <textarea id="textInput" class="form-control mb-3" rows="3">"La vita è come una bicicletta: per mantenere l'equilibrio, devi continuare a muoverti avanti." - Albert Einstein</textarea>
                <label for="speedRange">Скорость произношения: <span id="speedValue">1</span></label>
                <input type="range" id="speedRange" min="0.1" max="2" step="0.1" value="1" class="form-control mb-3">
                <label for="pitchRange">Высота произношения: <span id="pitchValue">1</span></label>
                <input type="range" id="pitchRange" min="0.1" max="2" step="0.1" value="1" class="form-control mb-3">
                <button id="speakTextButton" class="btn btn-primary btn-block mb-3">Произнести текст</button>
                <button id="setDefaultVoiceButton" class="btn btn-primary btn-block mb-3">Установить этот голос по умолчанию для Итальянского</button>


            </div>
        </div>
    </div>
</body>
</html>
