<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Настройки</title>
    <!-- Подключение стилей -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <!-- Подключение скрипта -->
    <script defer type="module" src="js/script.js?version=2.1"></script>
</head>
<body>
    <div class="container mt-2">
        <h1>Настройки</h1>
        <div class="row">
            <div class="col">
                <h3>Выберите язык</h3>
                    <select id="selectVoice" class="form-control mb-3">
                        <!-- Опции будут добавлены динамически с помощью JavaScript -->
                    </select>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h3>Введите текст для произнесения</h3>
                <textarea id="textInput" class="form-control mb-3" rows="3"></textarea>
                <label for="speedRange">Скорость произношения: <span id="speedValue">1</span></label>
                <input type="range" id="speedRange" min="0.1" max="2" step="0.1" value="1" class="form-control mb-3">
                <label for="pitchRange">Высота произношения: <span id="pitchValue">1</span></label>
                <input type="range" id="pitchRange" min="0.1" max="2" step="0.1" value="1" class="form-control mb-3">
                <button id="speakTextButton" class="btn btn-primary">Произнести текст</button>
            </div>
        </div>
    </div>
</body>
</html>
