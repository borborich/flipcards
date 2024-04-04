document.addEventListener("DOMContentLoaded", function () {
    let totalCount; // Общее количество записей
    let themeCounts = {}; // Количество записей в каждой теме
    //let totalQuestions = 0; // Общее количество заданных вопросов
    let correctAnswers = 0; // Количество правильных ответов
    let incorrectAnswers = 0; // Количество ошибочных ответов

    // Функция для заполнения списка доступных голосов
    function populateVoiceList() {
        var selectVoice = document.getElementById('selectVoice');
        // Очищаем список перед добавлением новых голосов
        selectVoice.innerHTML = '';
        // Добавляем каждый доступный голос в список
        var voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            voices.forEach(function(voice) {
                var option = document.createElement('option');
                option.textContent = voice.name + ' (' + voice.lang + ')';
                // Сохраняем идентификатор голоса в data-voice-id
                option.setAttribute('data-voice-id', voice.name);
                selectVoice.appendChild(option);
            });
        } else {
            // Если список голосов пуст, попробуйте загрузить его снова через некоторое время
            setTimeout(populateVoiceList, 500);
        }
    }

    // Проверяем, находимся ли мы на странице settings.php
    if (document.location.pathname === "/settings.php") {
        // Если да, вызываем функцию для заполнения списка голосов
        setTimeout(populateVoiceList, 600); // Задержка 500 миллисекунд (или другое подходящее значение)


        // Обработчик события для кнопки "Произнести текст"
        document.getElementById("speakTextButton").addEventListener("click", function () {
            // Получаем выбранный голос из списка
            var selectedVoiceId = document.getElementById("selectVoice").selectedOptions[0].getAttribute("data-voice-id");
            console.log(selectedVoiceId);
            // Получаем введенный текст
            var textToSpeak = document.getElementById("textInput").value;
            // Получаем значения скорости и высоты произношения
            var speedValue = parseFloat(document.getElementById("speedRange").value);
            var pitchValue = parseFloat(document.getElementById("pitchRange").value);
            // Вызываем функцию для произнесения текста с выбранными настройками
            speakText(textToSpeak, selectedVoiceId, speedValue, pitchValue);
        });

        // Обработчик события для ползунка скорости
        document.getElementById("speedRange").addEventListener("input", function () {
            // Получаем текущее значение ползунка скорости
            var speedValue = parseFloat(document.getElementById("speedRange").value);
            // Обновляем отображаемое значение скорости
            document.getElementById("speedValue").textContent = speedValue.toFixed(1);
        });

        // Обработчик события для ползунка высоты
        document.getElementById("pitchRange").addEventListener("input", function () {
            // Получаем текущее значение ползунка высоты
            var pitchValue = parseFloat(document.getElementById("pitchRange").value);
            // Обновляем отображаемое значение высоты
            document.getElementById("pitchValue").textContent = pitchValue.toFixed(1);
        });
    }




    // Функция для произношения текста с указанными настройками
    function speakText(text, speed = 1, pitch = 1) {
        var synth = window.speechSynthesis;
        var utterance = new SpeechSynthesisUtterance(text);
        //utterance.lang = 'it-IT'
        //utterance.voice = voice;

        // Устанавливаем скорость и высоту произношения
        utterance.rate = speed;
        utterance.pitch = pitch;
        // Произносим текст с указанными настройками
        synth.speak(utterance);
    }





    function loadWord() {
        console.log('Loading word...'); // Отладочный вывод
        const langParam = document.getElementById('word').getAttribute('data-lang'); // Получаем текущее направление языков
        console.log('Текущий языковой параметр:', langParam);
        const themeParam = document.getElementById('theme-select').value; // Получаем выбранную тему
        // Формируем URL с учетом выбранной темы
        const url = langParam === 'invert' ? `backend/get_word.php?lang=invert&theme=${themeParam}` : `backend/get_word.php?theme=${themeParam}`;
        console.log('Request URL:', url);

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
                        showModal('🥳🎉 Список слов закончился 🎉🥳', '🌟🚀 Вы прошли все слова из урока. 🌟🚀', 'https://memo.shbb.pro/table.php');
                        
                        // Очищаем список использованных слов
                        clearUsedWords();

                        // загружаем новое слово
                        loadWord();

                        // Обнуляем счетчики правильных ответов и ошибок
                        correctAnswers = 0;
                        incorrectAnswers = 0;

                        // Обновляем отображение счетчиков
                        updateCounters(); 

                        return;
                    }

                    // Установка параметров языка для слова и вариантов выбора
                    document.getElementById('word').setAttribute('lang', data.word_lang);
                    const choices = document.querySelectorAll('.choice');
                    choices.forEach((choice, index) => {
                        choice.innerText = data.choices[index];
                        choice.classList.remove('correct', 'incorrect');
                        choice.onclick = checkAnswer;
                        choice.setAttribute('lang', data.choices_lang);
                    });
                    // Добавляем атрибут data-correct с корректным переводом для последующей проверки
                    document.getElementById('word').setAttribute('data-correct', data.correct_translation);

                    // Вставка слова и вариантов выбора в соответствующие элементы DOM
                    document.getElementById('word').innerText = data.word;
                    const choicesString = data.choices.join(", ");
                    console.log("Choices result:", choicesString);
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

    function showModal(title, message, link) {
        // Создаем элементы модального окна
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2 style="text-align:center;">${title}</h2>
                <p style="text-align:center;">${message}</p>
                ${link ? `<a class="btn btn-primary" href="${link}">Перейти к таблицам</a>` : ''}
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
                const themeSelect = document.getElementById('theme-select') || document.getElementById('theme-select-table');
                themeSelect.innerHTML = '<option value="">Выберите урок</option>'; // Очищаем текущие опции
                data.forEach(theme => {
                    const option = document.createElement('option');
                    option.value = theme;
                    option.textContent = theme;
                    themeSelect.appendChild(option);
                });

                // Проверяем, есть ли параметр theme в URL
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('theme')) {
                    // Если есть, получаем его значение
                    const themeParam = urlParams.get('theme');
                    // Устанавливаем выбранную тему в форме
                    themeSelect.value = themeParam;
                    console.log('Загружаем тему из ссылки:', themeParam);
                    // Выполняем загрузку общего количества записей по выбранной теме
                    loadThemeCount(themeParam);
                    loadWord();
                } else {
                    console.log('Загружаем тему из выбора в форме');
                }
            })
            .catch(error => console.error('Error:', error));
    }


    // Проверяем, находимся ли мы на странице cards.php или table.php
    if (document.location.pathname === "/cards.php" || document.location.pathname === "/table.php") {
        // Вызываем функцию загрузки списка тем при загрузке страницы
        loadThemes();
    }

    // Выполняем только на странице cards.php
    if (document.location.pathname === "/cards.php") {

        // Добавляем обработчик события для кнопки произношения слова
        document.getElementById('speakWordButton').addEventListener('click', function() {
            var currentWord = document.getElementById('word').innerText;
            var selectedLanguage = document.getElementById('word').getAttribute('lang'); // Получаем выбранный язык из атрибута lang
            // Произносим текущее слово с выбранным языком
            speakText(currentWord, selectedLanguage);
        });

        // Получаем все кнопки озвучки вариантов ответов
        var speakButtons = document.querySelectorAll('.speakButton');

        // Добавляем обработчик события для каждой кнопки озвучки варианта ответа
        speakButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var answerText = this.previousElementSibling.innerText; // Получаем текст ответа, предшествующего кнопке
                var selectedLanguage = this.previousElementSibling.getAttribute('lang'); // Получаем выбранный язык из атрибута lang
                // Произносим текст ответа с выбранным языком
                speakText(answerText, selectedLanguage);
            });
        });

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
            // Обнуляем счетчики правильных ответов и ошибок
            correctAnswers = 0;
            incorrectAnswers = 0;
            // Вызов функции обновления счетчиков
            updateCounters();
            clearUsedWords();
            // Перезагружаем слово с учетом нового направления языков
            loadWord();

        });

        // Вызов функции обновления счетчиков
        updateCounters();
    }

    // Функция для загрузки слов по выбранной теме
    function loadWordsByTheme(theme) {
        fetch(`backend/get_words.php?theme=${theme}`)
            .then(response => response.json())
            .then(data => {
                const wordTable = document.getElementById('word-table').querySelector('tbody');
                wordTable.innerHTML = ''; // Очищаем текущие данные таблицы
                data.forEach(pair => {
                    const row = document.createElement('tr');
                    const russianWordCell = document.createElement('td');
                    const foreignWordCell = document.createElement('td');

                    // Добавляем текст в соответствующие ячейки
                    russianWordCell.textContent = pair.russian_word;
                    foreignWordCell.textContent = pair.foreign_word;

                    // Добавляем атрибуты lang для слов
                    foreignWordCell.setAttribute('lang', pair.foreign_word_lang);
                    russianWordCell.setAttribute('lang', "ru-RU")

                    // Добавляем класс для стилизации
                    foreignWordCell.classList.add('table-word');
                    russianWordCell.classList.add('table-word');

                    // Добавляем обработчик события клика для иностранного слова
                    foreignWordCell.addEventListener('click', function() {
                        speakText(pair.foreign_word, pair.foreign_word_lang);
                    });

                    russianWordCell.addEventListener('click', function() {
                        speakText(pair.russian_word, "ru-RU");
                    });

                    // Добавляем ячейки в строку и строку в таблицу
                    row.appendChild(russianWordCell);
                    row.appendChild(foreignWordCell);
                    wordTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Выполняем только на странице table.php
    if (document.location.pathname === "/table.php") {

        // Обработчик события изменения значения в списке выбора темы
        const themeSelect = document.getElementById('theme-select-table');
        themeSelect.addEventListener('change', function(event) {
            const selectedTheme = themeSelect.value;
            loadWordsByTheme(selectedTheme);

            // Обновляем ссылки на главную страницу с выбранной темой
            const cardsLinks = document.querySelectorAll('.cards-link'); // Получаем все ссылки с классом cards-link
            cardsLinks.forEach(link => {
                link.href = `cards.php?theme=${selectedTheme}`; // Обновляем значение href для каждой ссылки
            });

            // Показываем скрытые элементы после выбора темы
            document.querySelectorAll('#below-form-content, #word-table, .cards-link').forEach(element => {
                element.style.display = 'block';
            });            
        });
    }


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

