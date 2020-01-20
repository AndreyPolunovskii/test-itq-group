# test-itq-group
Test from itq-group


Для запуска проекта в докерах
нужно в корне проекта выполнить следующие команды:

1) Загрузить и запустить докеры

       docker-compose up -d

2) Обновить базу (создать таблицы)

       docker exec -it itq_test_backend_api python run.py db upgrade

3) Открыть в браузере страницу (если на той же машине то http://localhost/)

  Появится извещение что нет данных (первый запуск)
  Нажать кнопку "Загрузить данные с внешнего ресурса", и загрузятся данные согласно заданным параметрам.
  (Загрузка происходит сначала в базу, потом уже из базы на страничку)

  Дальше либо качать их из локальной базы (кнопка "Загрузить данные из локальной базы"), либо из внешнего ресурса ( соотвествующая кнопка )


Для сохранения проекта в другом docker-репозитории:

1) нужно в следующих скриптах

      /itq_test_backend_api/build.sh
      /itq_test_front/build.sh
      /docker-compose.yml

поменять название репозитория (в моем случае это andreyp2009) на ваш

2)собрать весь проект командой

   ./all_build.sh
