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
        const themeParam = document.getElementById('theme-select').value; // Получаем выбранную тему
        // Формируем URL с учетом выбранной темы
        const url = langParam === 'invert' ? `backend/get_word.php?lang=invert&theme=${themeParam}` : `backend/get_word.php?theme=${themeParam}`;

        const maxAttempts = 10; // Максимальное количество попыток
        let attempt = 0; // Счетчик попыток

        const fetchWord = () => {
            return fetch(url)
                .then(response => {
                    console.log('Response received:', response); // Отладочный вывод
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Возврат Promise объекта для обработки далее
                })
                .then(data => {
                    if (!data) {
                        throw new Error('Empty response data');
                    }
                    // Проверяем, является ли ответ флагом завершения списка
                    if (data.end_of_list) {
                        // Показываем модальное окно об окончании списка слов
                        showModal('Список слов закончился', 'Вы прошли все доступные слова. Хотите начать заново?', () => {
                            // Очищаем список использованных слов
                            clearUsedWords();
                            // Вызываем функцию загрузки нового слова
                            loadWord();
                        });
                        return;
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
                .catch(error => {
                    // Повторяем запрос, если остались попытки
                    if (attempt < maxAttempts) {
                        attempt++;
                        console.log(`Retrying... Attempt ${attempt}`);
                        return fetchWord();
                    } else {
                        // Отображаем модальное окно с сообщением об ошибке сети
                        showModal('Ошибка сети 📡 😔', 'Проверьте соединение с интернетом 📶 🌐 🤳 \nи помните, что отдых очень полезен для запоминания 💤 😘');
                    }
                });
        };

        return fetchWord();
    }

    // Функция для очистки списка использованных слов
    function clearUsedWords() {
        fetch('backend/get_word.php?clear_used_words')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Список использованных слов очищен');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function showModal(title, message) {
        // Создаем элементы модального окна
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${title}</h2>
                <p>${message}</p>
            </div>
        `;

        // Добавляем модальное окно в DOM
        document.body.appendChild(modal);

        // Обработчик события для закрытия модального окна
        const closeButton = modal.querySelector('.close');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
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

    // Функция для загрузки списка тем с бд
    function loadThemes() {
        fetch('backend/get_word.php?unique_themes')
            .then(response => response.json())
            .then(data => {
                const themeSelect = document.getElementById('theme-select');
                themeSelect.innerHTML = '<option value="">Все уроки</option>'; // Очищаем текущие опции
                data.forEach(theme => {
                    const option = document.createElement('option');
                    option.value = theme;
                    option.textContent = theme;
                    themeSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Вызываем функцию загрузки списка тем при загрузке страницы
    loadThemes();

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
        // Обнуляем счетчики правильных ответов и ошибок
        correctAnswers = 0;
        incorrectAnswers = 0;

        // Обновляем отображение счетчиков
        updateCounters();        

        // Добавляем вызов функции загрузки слов при изменении выбранной темы
        loadWord(); 
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

// Функция для добавления эффекта разлетающихся эмодзи 👍
function addFlyingEffect(element) {
    const container = document.getElementById('video-container'); // Контейнер, в котором происходит анимация
    const emoji = getRandomEmoji(); // Получаем случайный эмодзи
    for (let i = 0; i < 30; i++) {
        
        const flyingEmoji = document.createElement("div");
        flyingEmoji.innerText = emoji;
        flyingEmoji.style.position = 'absolute';
        flyingEmoji.style.left = `${Math.random() * 100}%`; // Случайное положение по горизонтали
        flyingEmoji.style.top = `${Math.random() * 100}%`; // Случайное положение по вертикали
        flyingEmoji.style.fontSize = `${Math.random() * 40 + 20}px`; // Случайный размер шрифта
        flyingEmoji.style.opacity = 0; // Начальная непрозрачность
        flyingEmoji.style.transition = 'all 1.9s ease-out'; // Анимация движения и исчезновения

        // Добавляем элемент в контейнер
        container.appendChild(flyingEmoji);

        // Задержка перед появлением эмодзи
        setTimeout(() => {
            // Устанавливаем случайное смещение
            flyingEmoji.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
            flyingEmoji.style.opacity = 1; // Постепенное появление
        }, 10);

        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            container.removeChild(flyingEmoji);
        }, 1900);
    }
}

// Функция для получения случайного эмодзи из массива
function getRandomEmoji() {
    var emoji = ['👍', '💪', '🚀', '🎉', '🏆', '🌟', '🎊', '🎈', '✨', '👏', '🙌', '😎', '💰', '💡', '💯', '🔥'];

    return emoji[Math.floor(Math.random() * emoji.length)];
}

