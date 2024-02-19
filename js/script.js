document.addEventListener("DOMContentLoaded", function () {
    let totalCount; // Общее количество записей
    let themeCounts = {}; // Количество записей в каждой теме
    //let totalQuestions = 0; // Общее количество заданных вопросов
    let correctAnswers = 0; // Количество правильных ответов
    let incorrectAnswers = 0; // Количество ошибочных ответов

    // Функция для загрузки нового слова и вариантов перевода
    function loadWord() {
        
        console.log('Loading word...'); // Отладочный вывод
        const langParam = document.getElementById('word').getAttribute('data-lang'); // Получаем текущее направление языков
        const url = langParam === 'invert' ? 'backend/get_word.php?lang=invert' : 'backend/get_word.php';

        fetch(url)
            .then(response => {
                console.log('Response received:', response); // Отладочный вывод
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Возврат Promise объекта для обработки далее
            })
            .then(data => {
                console.log('Response json:', data); // Отладочный вывод
                if (!data) {
                    throw new Error('Empty response data');
                }
                document.getElementById('word').innerText = data.word;
                const choices = document.querySelectorAll('.choice');
                choices.forEach((choice, index) => {
                    choice.innerText = data.choices[index];
                    choice.classList.remove('correct', 'incorrect');
                    choice.onclick = checkAnswer;
                });
                // Добавляем атрибут data-correct с корректным переводом для последующей проверки
                document.getElementById('word').setAttribute('data-correct', data.correct_translation);
            })
            .catch(error => console.error('Error:', error));
    }

    // Функция для проверки ответа пользователя
    function checkAnswer() {
        const selectedChoice = this;
        const correctTranslation = document.getElementById('word').getAttribute('data-correct');
        if (selectedChoice.innerText === correctTranslation) {
            selectedChoice.classList.add('correct');
            correctAnswers++; // Увеличиваем счетчик правильных ответов
            //totalQuestions++; // Увеличиваем счетчик заданных вопросов
            // Вызов функции обновления счетчиков
            updateCounters();
            addFlyingEffect(selectedChoice);
            // Добавляем задержку перед вызовом loadWord()
            setTimeout(() => {
                loadWord();
            }, 1900); // Таймер на 2 секунды
        } else {
            selectedChoice.classList.add('incorrect');
            incorrectAnswers++; // Увеличиваем счетчик ошибочных ответов
            // Вызов функции обновления счетчиков
            updateCounters();
        }
    }

    // Функция для загрузки общего количества записей
    function loadTotalCount() {
        fetch('backend/get_word.php?total_count')
            .then(response => response.json())
            .then(data => {
                totalCount = data.total_count;
                updateRecordCount();
            })
            .catch(error => console.error('Error:', error));
    }

    // Функция для загрузки количества записей по выбранной теме
    function loadThemeCount(theme) {
        fetch(`backend/get_word.php?theme_count=${theme}&theme=${theme}`)
            .then(response => response.json())
            .then(data => {
                themeCounts[theme] = data.count;
                updateRecordCount();
            })
            .catch(error => console.error('Error:', error));
    }

    // Функция для обновления отображения количества записей
    function updateRecordCount() {
        const selectedTheme = document.getElementById('theme-select').value;
        const count = selectedTheme ? themeCounts[selectedTheme] : totalCount;
        document.getElementById('record-count').innerText = `🎲: ${count}`;
    }

    // Функция для обновления счетчиков
    function updateCounters() {
        //document.getElementById('total-questions').innerText = `Всего вопросов: ${totalQuestions}`;
        document.getElementById('correct-answers').innerText = `✅: ${correctAnswers}`;
        document.getElementById('incorrect-answers').innerText = `🚫: ${incorrectAnswers}`;
    }

    // Загрузка общего количества записей при загрузке страницы
    loadTotalCount();

    // Загрузка первого слова при загрузке страницы
    loadWord();

    // Обновление количества записей при изменении выбранной темы
    document.getElementById('theme-select').addEventListener('change', function () {
        const selectedTheme = this.value;
        if (selectedTheme) {
            loadThemeCount(selectedTheme);
        } else {
            updateRecordCount();
        }
    });

    // Обработчик события для кнопки инверсии языков
    document.getElementById('invert').addEventListener('click', function () {
        const langParam = document.getElementById('word').getAttribute('data-lang');
        // Меняем значение параметра lang для инверсии языков
        const newLangParam = langParam === 'invert' ? '' : 'invert';
        document.getElementById('word').setAttribute('data-lang', newLangParam);
        // Перезагружаем слово с учетом нового направления языков
        loadWord();
    });

    // Вызов функции обновления счетчиков
    updateCounters();
});

// Функция для добавления эффекта разлетающихся 👍
function addFlyingEffect(element) {
    function random(max) {
        return Math.random() * (max - 0) + 0;
    }

    const container = document.getElementById('video-container'); // Контейнер, в котором происходит анимация
    const flyingElement = document.createElement('div');
    flyingElement.style.position = 'absolute';

    for (let i = 0; i < 30; i++) {
        const randomSize = Math.random() * (65 - 40) + 40;
        const styles = `
            transform: translate3d(${random(500) - 250}px, ${random(300) - 150}px, 50px)
            rotate(${random(360)}deg) scale(0.5);
            background: transparent;
            width: ${randomSize}px;
            height: ${randomSize}px;
            animation: bang 1900ms ease-out forwards;
            opacity: 0;
        `;

        const heartImage = document.createElement("img");
        heartImage.setAttribute("src", "img/thumbs-up.ico");
        heartImage.style.cssText = styles;
        flyingElement.appendChild(heartImage);
    }

    container.appendChild(flyingElement);

    setTimeout(() => {
        container.removeChild(flyingElement);
    }, 1900);
}
