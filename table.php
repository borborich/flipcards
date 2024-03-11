<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Таблица слов</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
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
                <a href="cards.php" class="btn btn-secondary">Перейти к карточкам</a>
            </div>
        </div>
    </div>
    <div class="container mt-2">
        <div class="row">
            <div class="col">
                    <h1>Таблица слов</h1>

                    <form id="theme-form" class="form-inline mt-4">
                        <select id="theme-select" class="form-control mr-sm-3">
                            <!-- Опции будут добавлены динамически с помощью JavaScript -->
                        </select>
                    </form>
                    

                    <a class="btn btn-primary mt-4 cards-link" href="#">Перейти к карточкам этого урока</a>

                    <div id="word-table" class="mt-4 table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Русское слово</th>
                                    <th scope="col">Итальянское слово</th>
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

    <script src="js/script.js"></script>
</body>
</html>
